import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const routesInfo = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/users",
        route: UserRoutes,
    },
];

routesInfo.forEach((route) => router.use(route.path, route.route));

export default router;
