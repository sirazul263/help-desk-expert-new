import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HelpDeskXpert",
    short_name: "HelpDeskXpert",
    description:
      "World-class outsourced customer support agents for SaaS companies.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0f13",
    theme_color: "#ff5c35",
    icons: [
      {
        src: "/img/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  };
}
