/**
 * @openapi
 * components:
 *  schemas:
 *    AuthSignUpInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - roles
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: adminAdmin1%
 *        roles:
 *          type: string
 *          description: Allow only manager or user
 *          default: user
 *          enum:
 *          - manager
 *          - user
 *          - administrator
 *    UserCreatedResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        password:
 *          type: string
 *        roles:
 *          type: string
 *        boss:
 *          type: string
 *          nullable: true
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        __v:
 *          type: integer
 *    AuthLoginInput:
 *      type: object
 *      required:
 *        - login
 *        - password
 *      properties:
 *        login:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: adminAdmin1%
 *    UserLoginResponse:
 *      type: object
 *      properties:
 *        user:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            name:
 *              type: string
 *            password:
 *              type: string
 *            roles:
 *              type: string
 *            boss:
 *              type: string
 *              nullable: true
 *            _id:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *            __v:
 *              type: integer
 *        access_token:
 *          type: string
 *        refresh_token:
 *          type: string
 *    UpdInputByAdminSchema:
 *      description: Admin can update any user
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: adminAdmin1%
 *        boss:
 *          type: string
 *          minLength: 24
 *          maxLength: 24
 *        roles:
 *          type: string
 *          description: Allow only manager or user
 *          default: user
 *          enum:
 *          - manager
 *          - user
 *          - administrator
 *    UpdInputByBossSchema:
 *      description: Manager can update his subordinate
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: adminAdmin1%
 *        boss:
 *          type: string
 *          minLength: 24
 *          maxLength: 24
 *        roles:
 *          type: string
 *          description: Allow only manager or user
 *          default: user
 *          enum:
 *          - manager
 *          - user
 *    UpdInputByUserSchema:
 *      description: Regular user can update only himself
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: adminAdmin1%
 *    UserUpdatedResponseSchema:
 *      description: Response with success updated user
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          default: user with 'id:6365937daf5e364ad8080b52' has updated
 *        user:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              default: 6365937daf5e364ad8080b52
 *            email:
 *              type: string
 *              default: jane.doe@example.com
 *            name:
 *              type: string
 *              default: Jane Doe
 *            password:
 *              type: string
 *              default: $2a$07$A/0WE5ANyVyqVzyXf87Fr.0Go1bretpSbFGi8qaQoEib/6x7OyjK6
 *            roles:
 *              type: string
 *              default: user
 *              enum:
 *                - manager
 *                - administrator
 *                - user
 *            boss:
 *              type: string
 *              default: 6365937daf5e364ad8080b52
 *              nullable: true
 *            subordinates:
 *              type: array
 *              items:
 *                type: string
 *              uniqueItems: true
 *              default: ['6365c7f87dff7bb500ca975f', '636593f1af5e364ad8080b5c']
 *            createdAt:
 *              type: string
 *              default: 2022-11-04T22:34:37.183Z
 *            updatedAt:
 *              type: string
 *              default: 2022-11-07T22:34:37.183Z
 *    UserResponseRecursiveSchema:
 *      description: Response with success operation - get data user
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          default: 6365937daf5e364ad8080b52
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        roles:
 *          type: string
 *          default: user
 *          enum:
 *            - manager
 *            - administrator
 *            - user
 *        boss:
 *          type: string
 *          default: 6365937daf5e364ad8080b53
 *          nullable: true
 *        subordinates:
 *          type: array
 *          items:
 *            - $ref: '#/components/schemas/UserResponseSchema'
 *          uniqueItems: true
 *          default: [{"_id": "6365937daf5e364ad8080b51", "email": "jane.doew@example.com", "name": "Jane Doe2", "roles": "manager", "boss": "6365937daf5e364ad8080b55", "subordinates": []}, {...}, {n: n}]
 *    UserResponseSchema:
 *      description: Response with success operation - get data user
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          default: 6365937daf5e364ad8080b52
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        roles:
 *          type: string
 *          default: user
 *          enum:
 *            - manager
 *            - administrator
 *            - user
 *        boss:
 *          type: string
 *          default: 6365937daf5e364ad8080b53
 *          nullable: true
 *        subordinates:
 *          type: array
 *          items:
 *            type: string
 *          uniqueItems: true
 *          default: ['id1', 'id2', 'id3']
 *    ResponseAllUserSchema:
 *      description: array of objects user data
 *      type: array
 *      items:
 *        type: object
 *        $ref: '#/components/schemas/UserResponseSchema' 
 */
