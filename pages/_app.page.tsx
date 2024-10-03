import { MantineProvider, Global } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Provider as ReduxProvider } from "react-redux";

import AppInitializer from "@/shared/components/wrappers/AppInitializer";
import AuthGuard from "@/shared/components/wrappers/AuthGuard/AuthGuard";
import { store } from "@/shared/redux/store";
import { TCustomAppProps } from "@/shared/typedefs";

export default function App(props: TCustomAppProps) {
  const { Component, pageProps } = props;

  const component = Component.Layout ? (
    <Component.Layout>
      <Component {...pageProps} />
    </Component.Layout>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <ReduxProvider store={store}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          colors: {
            navy: ["#151d35"],
            green: ["#4CAF50"],
          },
          primaryColor: "navy",
        }}
      >
        <Global
          styles={(theme) => ({
            body: {
              backgroundColor: theme.colors["navy"],
            },
          })}
        />
        <ModalsProvider>
          <AppInitializer>
            <Notifications />
            <AuthGuard>
              {Component.Guard ? <Component.Guard>{component}</Component.Guard> : component}
            </AuthGuard>
          </AppInitializer>
        </ModalsProvider>
      </MantineProvider>
    </ReduxProvider>
  );
}
