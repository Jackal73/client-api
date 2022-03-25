# &copy;Tikkit - client side API

This API is part of the &copy;`Tikkit` *- Issue Tracking System*.

&copy;`Tikkit` was created using the MERN stack.

Link to the &copy;`Tikkit` *- Issue Tracking System* : <https://www.kbldesigners.com>.

## How to use

- run `git clone https://github.com/Jackal73/client-api.git`
- run `npm install`
- run `npm start`

Note: *Make sure you have `nodemon` installed on your system;* otherwise, *you can install it as a* "dev dependencies" *in the project.*

## API Resources

### User API Resources

All of the `user` API routers follow `/v1/user/`

| #   | Routers                   | Request | Progress | Is Private | Description                                      |
| --- | ------------------------- | ------- | -------- | ---------- | ------------------------------------------------ |
| 1   | `/v1/user`                | GET     |   Done   |    Yes     | Get user info                                    |
| 2   | `/v1/user`                | POST    |   Done   |    No      | Create a user                                    |
| 3   | `/v1/user/login`          | POST    |   Done   |    No      | Verify user Authentication and return JWT        |
| 4   | `/v1/user/reset-password` | POST    |   Done   |    No      | Verify email and email pin to reset the password |
| 5   | `/v1/user/reset-password` | PATCH   |   Done   |    No      | Replace with new password                        |
| 6   | `/v1/user/logout`         | DELETE  |   Done   |    Yes     | Delete user access JWT                           |

### Ticket API Resources

All of the `ticket` API routers follow `/v1/ticket/`

| #   | Routers                        | Request | Progress | Is Private | Description                             |
| --- | ------------------------------ | ------- | -------- | ---------- | --------------------------------------- |
| 1   | `/v1/ticket`                   | GET     |   Done   |    Yes     | Get all tickets for the logged in user  |
| 2   | `/v1/ticket/{id}`              | GET     |   Done   |    Yes     | Get ticket details                      |
| 3   | `/v1/ticket`                   | POST    |   Done   |    Yes     | Create a new ticket                     |
| 4   | `/v1/ticket/{id}`              | PUT     |   Done   |    Yes     | Update ticket details - reply message   |
| 5   | `/v1/ticket/close-ticket/{id}` | PATCH   |   Done   |    Yes     | Update ticket status to close           |
| 6   | `/v1/ticket/{id}`              | DELETE  |   Done   |    Yes     | Delete a ticket                         |

### Tokens API Resources

All of the `tokens` API routers follow `/v1/tokens`

| #   | Routers      | Request | Progress | Is Private | Description            |
| --- | ------------ | ------- | -------- | ---------- | ---------------------- |
| 1   | `/v1/tokens` | GET     |   Done   |     No     | Get a new access JWT   |
