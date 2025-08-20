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
      await FileSystem.writeAsStringAsync(fileUri, news, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      // Kiểm tra có hỗ trợ share không
      const canShare = await Sharing.isAvailableAsync()
      if (!canShare) {
        Alert.alert("Thiết bị không hỗ trợ chia sẻ file")
        return
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Chia sẻ tin tức",
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
