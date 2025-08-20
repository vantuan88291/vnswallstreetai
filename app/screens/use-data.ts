import { useRef, useState } from "react";
import { Alert } from "react-native"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { format } from "date-fns"

import { api } from "@/services/api"

export const useData = () => {
  const [limit, setLimit] = useState("300")
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState<string>("")
  const fileCache = useRef<string>(null)

  const getData = async () => {
    setLoading(true)
    const data = await api.getNews(limit)
    const dataNews = (data?.data?.data || [])
      .filter((item: any) => item?.content)
      .map(
        (item: any) =>
          `[${format(new Date(item?.createtime), "yyyy-MM-dd HH:mm:ss")}] ${item.content}`,
      )
      .join("\n\n")
    setNews(dataNews)
    setLoading(false)
  }
  const onStartShare = async () => {
    try {
      const fileUri = FileSystem.cacheDirectory + "news.txt"
      fileCache.current = fileUri
      const content = `Bạn là chuyên gia phân tích thị trường crypto.\n
Dưới đây là danh sách tin tức trong vài giờ qua, mỗi tin có thời gian cụ thể: \n 

${news}

Nhiệm vụ của bạn:  
1. Tóm tắt các tin tức quan trọng theo trình tự thời gian.  
2. Đánh giá tin nào có ảnh hưởng mạnh/yếu đến thị trường crypto (BTC, ETH, Altcoin).  
3. Dự đoán xu hướng thị trường crypto trong 24h tới (Tăng / Giảm / Sideways) kèm lý do.  
4. Nếu có thể, hãy chỉ ra tin tức nào mang tính dài hạn và tin nào chỉ mang tính ngắn hạn.`
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      const canShare = await Sharing.isAvailableAsync()
      if (!canShare) {
        Alert.alert("Thiết bị không hỗ trợ chia sẻ file")
        return
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Chia sẻ",
      })
    } catch (e: any) {
      Alert.alert(e.toString())
    } finally {
      // @ts-ignore
      FileSystem.deleteAsync(fileCache.current, { idempotent: true });
    }
  }
  return {
    limit,
    setLimit,
    getData,
    news,
    loading,
    onStartShare,
  }
}
