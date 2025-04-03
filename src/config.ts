const config = {
    appName: "Marketplace App",
    appDescription:
      "Marketplace for buying and selling companies.",
    domainName:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://marketplace.com",
  };
  
  export default config;