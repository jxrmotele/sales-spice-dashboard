import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "COACH";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "COACH";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "COACH";
  }
}
