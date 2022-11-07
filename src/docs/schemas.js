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
 */