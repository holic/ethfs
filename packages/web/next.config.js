// Expose RPC URLs to Next via `NEXT_PUBLIC_` prefix so we don't have to duplicate them
const rpcUrls = Object.entries(process.env)
  .filter(([key, value]) => /^RPC_HTTP_URL_\d+$/.test(key))
  .map(([key, value]) => [`NEXT_PUBLIC_${key}`, value]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ...Object.fromEntries(rpcUrls),
  },
  webpack: (config) => {
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
