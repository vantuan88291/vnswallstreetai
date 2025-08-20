import { FC } from "react"
import { ScrollView, TextStyle, View, ViewStyle, ActivityIndicator } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useData } from "@/screens/use-data"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export const WelcomeScreen: FC = function WelcomeScreen() {
  const { themed } = useAppTheme()
  const { limit, setLimit, getData, loading, news, onStartShare } = useData()

  return (
    <Screen safeAreaEdges={["top", "bottom"]} preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($topContainer)}>
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          text={"Get news"}
          preset="heading"
        />
        <TextField
          keyboardType={"numeric"}
          placeholder={"Limit number"}
          value={limit}
          onChangeText={setLimit}
          containerStyle={themed($welcomeHeading)}
          label={"Limit of news"}
        />
        <ScrollView>
          <Text style={themed($welcomeHeading)} selectable text={news} />
        </ScrollView>
      </View>

      <View style={themed($bottomContainer)}>
        <Button disabled={loading} onPress={getData} text={loading ? undefined : "Start"}>
          <ActivityIndicator size={"small"} />
        </Button>
        <View style={themed($row)}>
          <Button
            style={$styles.flex1}
            onPress={onStartShare}
            preset={"reversed"}
            text={"Share result"}
          />
        </View>
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  paddingHorizontal: spacing.lg,
})
const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
  gap: spacing.xs,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
