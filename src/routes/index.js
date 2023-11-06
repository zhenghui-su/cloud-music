import React from 'react';
import { Redirect } from "react-router-dom";
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Home from '../application/Home';
import Album from '../application/Album';
import Singer from '../application/Singer';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: "/",
        component: Home,
        routes: [
            {
                path: "/",
                exact: true,
                render: () => (
                    <Redirect to={"/recommend"} />
                )
            },
            {
                path: "/recommend/",
                component: Recommend,
                routes: [
                    {
                        path: "/recommend/:id",
                        component: Album
                    }
                ]
            },
            {
                path: "/singers",
                component: Singers,
                key: "singers",
                routes: [
                    {
                        path: "/singers/:id",
                        component: Singer
                    }
                ]
            },
            {
                path: "/rank/",
                component: Rank,
                key: "rank",
                routes: [
                    {
                        path: "/rank/:id",
                        component: Album
                    }
                ]
            },
        ]
    }
]