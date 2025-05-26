import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { AssetRoute } from "../modules/assets/assets.route";
import { FolderRoutes } from "../modules/folder/folder.route";

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
    {
        path: "/assets",
        route: AssetRoute,
    },
    {
        path: "/folders",
        route: FolderRoutes,
    },
];

routesInfo.forEach((route) => router.use(route.path, route.route));

export default router;
