const express = require('express');

const Time_slotsService = require('../services/time_slots');
const Time_slotsDBApi = require('../db/api/time_slots');
const wrapAsync = require('../helpers').wrapAsync;

const config = require('../config');

const router = express.Router();

const { parse } = require('json2csv');

const { checkCrudPermissions } = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('time_slots'));

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Time_slots:
 *        type: object
 *        properties:

 */

/**
 *  @swagger
 * tags:
 *   name: Time_slots
 *   description: The Time_slots managing API
 */

/**
 *  @swagger
 *  /api/time_slots:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Add new item
 *      description: Add new item
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Time_slots"
 *      responses:
 *        200:
 *          description: The item was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Time_slots"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */
router.post(
  '/',
  wrapAsync(async (req, res) => {
    const link = new URL(req.headers.referer);
    await Time_slotsService.create(
      req.body.data,
      req.currentUser,
      true,
      link.host,
    );
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Time_slots]
 *    summary: Bulk import items
 *    description: Bulk import items
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          properties:
 *            data:
 *              description: Data of the updated items
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Time_slots"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Time_slots"
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      405:
 *        description: Invalid input data
 *      500:
 *        description: Some server error
 *
 */
router.post(
  '/bulk-import',
  wrapAsync(async (req, res) => {
    const link = new URL(req.headers.referer);
    await Time_slotsService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/time_slots/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Update the data of the selected item
 *      description: Update the data of the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new item data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated item
 *                  type: string
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Time_slots"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The item data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Time_slots"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await Time_slotsService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/time_slots/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Delete the selected item
 *      description: Delete the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The item was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Time_slots"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await Time_slotsService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/time_slots/deleteByIds:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Delete the selected item list
 *      description: Delete the selected item list
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                ids:
 *                  description: IDs of the updated items
 *                  type: array
 *      responses:
 *        200:
 *          description: The items was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Time_slots"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Items not found
 *        500:
 *          description: Some server error
 */
router.post(
  '/deleteByIds',
  wrapAsync(async (req, res) => {
    await Time_slotsService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/time_slots:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Get all time_slots
 *      description: Get all time_slots
 *      responses:
 *        200:
 *          description: Time_slots list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Time_slots"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const filetype = req.query.filetype;

    const globalAccess = req.currentUser.app_role.globalAccess;

    const payload = await Time_slotsDBApi.findAll(req.query, globalAccess);
    if (filetype && filetype === 'csv') {
      const fields = ['id', 'start_time', 'end_time'];
      const opts = { fields };
      try {
        const csv = parse(payload.rows, opts);
        res.status(200).attachment(csv);
        res.send(csv);
      } catch (err) {
        console.error(err);
      }
    } else {
      res.status(200).send(payload);
    }
  }),
);

/**
 *  @swagger
 *  /api/time_slots/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Count all time_slots
 *      description: Count all time_slots
 *      responses:
 *        200:
 *          description: Time_slots count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Time_slots"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/count',
  wrapAsync(async (req, res) => {
    const globalAccess = req.currentUser.app_role.globalAccess;

    const payload = await Time_slotsDBApi.findAll(req.query, globalAccess, {
      countOnly: true,
    });

    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/time_slots/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Find all time_slots that match search criteria
 *      description: Find all time_slots that match search criteria
 *      responses:
 *        200:
 *          description: Time_slots list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Time_slots"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/autocomplete', async (req, res) => {
  const globalAccess = req.currentUser.app_role.globalAccess;

  const organizationId = req.currentUser.organization?.id;

  const payload = await Time_slotsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    globalAccess,
    organizationId,
  );

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/time_slots/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Time_slots]
 *      summary: Get selected item
 *      description: Get selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of item to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected item successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Time_slots"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await Time_slotsDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
