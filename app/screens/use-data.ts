import { useEffect, useState } from "react";
import { Alert } from "react-native"
import { format } from "date-fns"
import Share from "react-native-share"

import { api } from "@/services/api"
import { loadString, saveString } from "@/utils/storage";

export const useData = () => {
  const [limit, setLimit] = useState("")
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState<string>("")

  useEffect(() => {
    setLimit(loadString("limit") || "50")
    setNews(loadString("news") || "")
  }, [])
  const onChangeLimit = (text: string) => {
    setLimit(text)
    saveString("limit", text)
  }
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
    saveString("news", dataNews)
    setLoading(false)
  }
  const onStartShare = async () => {
    try {
      const content = `Bạn là chuyên gia phân tích thị trường crypto.\n
Nhiệm vụ của bạn:  
1. Đánh giá tin nào có ảnh hưởng mạnh đến thị trường crypto (BTC, ETH, Altcoin).  
2. Dự đoán xu hướng thị trường crypto trong 24h tới (Tăng / Giảm / Sideways) kèm lý do.  
3. Nếu có thể, hãy chỉ ra tin tức nào mang tính dài hạn và tin nào chỉ mang tính ngắn hạn.\`\n
Dưới đây là danh sách tin tức trong vài giờ qua, mỗi tin có thời gian cụ thể ở bên cạnh, hãy dựa vào những tin tức đó để thực hiện nhiệm vụ của bạn:\n 
${news}`
      await Share.open({
        message: content,
      })
    } catch (e: any) {
      Alert.alert(e.toString())
    } finally {
      // @ts-ignore
    }
  }
  return {
    limit,
    setLimit: onChangeLimit,
    getData,
    news,
    loading,
    onStartShare,
  }
}
