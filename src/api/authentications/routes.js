const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.loginHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.updateRefreshTokenHandler,
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteRefreshTokenHandler,
  },
];

module.exports = routes;
