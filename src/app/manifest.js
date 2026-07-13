export default function manifest() {
  return {
    name: "أنماط | Anmaat - نظام إدارة المؤسسات",
    short_name: "أنماط",
    description: "منصة متكاملة لإدارة المؤسسات والفرق",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#375DFB",
    dir: "rtl",
    lang: "ar",
    orientation: "portrait-primary",
    icons: [
      { src: "/images/logoBlue.png", sizes: "512x512", type: "image/png" },
      { src: "/images/logoBlue.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
