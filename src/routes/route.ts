import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const routesInfo = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
];

routesInfo.forEach((route) => router.use(route.path, route.route));

export default router;
