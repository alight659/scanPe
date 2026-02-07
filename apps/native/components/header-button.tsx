import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable, type View } from "react-native";

import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme-provider";

export const HeaderButton = forwardRef<View, { onPress?: () => void }>(
	({ onPress }, ref) => {
		const { colorScheme } = useColorScheme();
		const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

		return (
			<Pressable
				ref={ref}
				onPress={onPress}
				className="mr-2 p-2"
				style={({ pressed }) => ({
					backgroundColor: pressed ? theme.background : theme.card,
				})}
			>
				{({ pressed }) => (
					<FontAwesome
						name="info-circle"
						size={20}
						color={theme.text}
						style={{
							opacity: pressed ? 0.7 : 1,
						}}
					/>
				)}
			</Pressable>
		);
	},
);
