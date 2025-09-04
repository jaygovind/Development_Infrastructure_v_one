module.exports = {
  apps: [
    {
      name: "api",
      cwd: "apps/api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: process.env.API_PORT || 4000
      }
    },
    {
      name: "web",
      cwd: "apps/web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: process.env.WEB_PORT || 3000
      }
    }
  ]
};
