const NoteModel = require('../models/note.model');
const { body } = require("express-validator");


exports.createNote = [
    body("title").isLength({
        min: 1
    }).trim().withMessage("title must be specified."),
    body("body").isLength({
        min: 1
    }).trim().withMessage("body must be specified."),

    async (req, res) => {

        const { title, body } = req.body;

        try {
            // check whether the title exists or not
            var is_title_exist = await NoteModel.findOne({ title: title });
            if (is_title_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `title already exists, please enter new title`
                    }
                });
            }

            // to save item;
            const newNote = await NoteModel.create({
                title: title,
                body: body
            });

            if (newNote) {
                // once the note is created, give the response.
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: `new note is created`,
                        note: newNote
                    }
                });
            } else {
                res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to create new note`,
                    }
                });
            }
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]


exports.getNote = [
    body("itemId").isLength({
        min: 1
    }).trim().withMessage("itemId must be specified."),
    body("customerId").isLength({
        min: 1
    }).trim().withMessage("customerId must be specified."),
    body("deliveryVehicleId").isLength({
        min: 1
    }).trim().withMessage("deliveryVehicleId must be specified."),
    body("isDelivered").isLength({
        min: 1
    }).trim().withMessage("isDelivered must be specified."),

    async (req, res) => {
        let randomString = random.randomAlphanumeric(5, "lowercase"); //Returns b2pdk;

        const { itemId, customerId, deliveryVehicleId } = req.body;

        try {
            // check whether the item id exists or not
            var is_item_exist = await Item.findOne({ _id: itemId });
            if (!is_item_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid item id`
                    }
                });
            }

            let price = is_item_exist.price;


            // check whether the customer exists or not
            var is_customer_exist = await Customer.findOne({ _id: customerId });
            if (!is_customer_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid customer id`
                    }
                });
            }

            // check whether deliveryvehicle exists or not; also check whether it contains max 2 active orders.
            var is_delivery_vehicle_exist = await DeliveryVehicle.findOne({ _id: deliveryVehicleId });
            if (!is_delivery_vehicle_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid vehicle id`
                    }
                });
            }

            // if the vehicle exists then check for the active orders.
            let liveOrdersCount = is_delivery_vehicle_exist.activeOrdersCount;
            if (liveOrdersCount == 2) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle contains maximum active orders`
                    }
                });
            }

            // check the city where delivery vehicle serves and customer city matches or not.
            let vehicleServingTheCity = is_delivery_vehicle_exist.city;
            let customerCity = is_customer_exist.city;
            if (vehicleServingTheCity !== customerCity) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle is not available in your city`
                    }
                });
            }

            // to save item;
            const newOrder = await Order.create({
                orderNumber: randomString,
                itemId: itemId,
                price: price,
                customerId: customerId,
                deliveryVehicleId: deliveryVehicleId,
                isDelivered: false
            });

            if (newOrder) {
                // once the order is created, increase the active order count for the delivery vehicle.
                let newLiveOrdersCount = liveOrdersCount + 1;
                await DeliveryVehicle.findByIdAndUpdate({ _id: is_delivery_vehicle_exist._id }, { activeOrdersCount: newLiveOrdersCount })

                res.status(201).json({
                    status: 'success',
                    data: {
                        message: `new order is created`,
                        order: newOrder
                    }
                });
            } else {
                res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to create new order`,
                    }
                });
            }
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]


exports.listAllNotes = [
    body("itemId").isLength({
        min: 1
    }).trim().withMessage("itemId must be specified."),
    body("customerId").isLength({
        min: 1
    }).trim().withMessage("customerId must be specified."),
    body("deliveryVehicleId").isLength({
        min: 1
    }).trim().withMessage("deliveryVehicleId must be specified."),
    body("isDelivered").isLength({
        min: 1
    }).trim().withMessage("isDelivered must be specified."),

    async (req, res) => {
        let randomString = random.randomAlphanumeric(5, "lowercase"); //Returns b2pdk;

        const { itemId, customerId, deliveryVehicleId } = req.body;

        try {
            // check whether the item id exists or not
            var is_item_exist = await Item.findOne({ _id: itemId });
            if (!is_item_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid item id`
                    }
                });
            }

            let price = is_item_exist.price;


            // check whether the customer exists or not
            var is_customer_exist = await Customer.findOne({ _id: customerId });
            if (!is_customer_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid customer id`
                    }
                });
            }

            // check whether deliveryvehicle exists or not; also check whether it contains max 2 active orders.
            var is_delivery_vehicle_exist = await DeliveryVehicle.findOne({ _id: deliveryVehicleId });
            if (!is_delivery_vehicle_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid vehicle id`
                    }
                });
            }

            // if the vehicle exists then check for the active orders.
            let liveOrdersCount = is_delivery_vehicle_exist.activeOrdersCount;
            if (liveOrdersCount == 2) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle contains maximum active orders`
                    }
                });
            }

            // check the city where delivery vehicle serves and customer city matches or not.
            let vehicleServingTheCity = is_delivery_vehicle_exist.city;
            let customerCity = is_customer_exist.city;
            if (vehicleServingTheCity !== customerCity) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle is not available in your city`
                    }
                });
            }

            // to save item;
            const newOrder = await Order.create({
                orderNumber: randomString,
                itemId: itemId,
                price: price,
                customerId: customerId,
                deliveryVehicleId: deliveryVehicleId,
                isDelivered: false
            });

            if (newOrder) {
                // once the order is created, increase the active order count for the delivery vehicle.
                let newLiveOrdersCount = liveOrdersCount + 1;
                await DeliveryVehicle.findByIdAndUpdate({ _id: is_delivery_vehicle_exist._id }, { activeOrdersCount: newLiveOrdersCount })

                res.status(201).json({
                    status: 'success',
                    data: {
                        message: `new order is created`,
                        order: newOrder
                    }
                });
            } else {
                res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to create new order`,
                    }
                });
            }
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]


exports.listNotesByKeyword = [
    query("searchKey").isLength({
        min: 1
    }).trim().withMessage("searchKey must be specified."),

    async (req, res) => {

        const { searchKey } = req.query;

        try {
            // check whether the item id exists or not
            var is_item_exist = await Item.findOne({ _id: itemId });
            if (!is_item_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid item id`
                    }
                });
            }

            let price = is_item_exist.price;


            // check whether the customer exists or not
            var is_customer_exist = await Customer.findOne({ _id: customerId });
            if (!is_customer_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid customer id`
                    }
                });
            }

            // check whether deliveryvehicle exists or not; also check whether it contains max 2 active orders.
            var is_delivery_vehicle_exist = await DeliveryVehicle.findOne({ _id: deliveryVehicleId });
            if (!is_delivery_vehicle_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid vehicle id`
                    }
                });
            }

            // if the vehicle exists then check for the active orders.
            let liveOrdersCount = is_delivery_vehicle_exist.activeOrdersCount;
            if (liveOrdersCount == 2) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle contains maximum active orders`
                    }
                });
            }

            // check the city where delivery vehicle serves and customer city matches or not.
            let vehicleServingTheCity = is_delivery_vehicle_exist.city;
            let customerCity = is_customer_exist.city;
            if (vehicleServingTheCity !== customerCity) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `this vehicle is not available in your city`
                    }
                });
            }

            // to save item;
            const newOrder = await Order.create({
                orderNumber: randomString,
                itemId: itemId,
                price: price,
                customerId: customerId,
                deliveryVehicleId: deliveryVehicleId,
                isDelivered: false
            });

            if (newOrder) {
                // once the order is created, increase the active order count for the delivery vehicle.
                let newLiveOrdersCount = liveOrdersCount + 1;
                await DeliveryVehicle.findByIdAndUpdate({ _id: is_delivery_vehicle_exist._id }, { activeOrdersCount: newLiveOrdersCount })

                res.status(201).json({
                    status: 'success',
                    data: {
                        message: `new order is created`,
                        order: newOrder
                    }
                });
            } else {
                res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to create new order`,
                    }
                });
            }
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]


exports.updateNote = [

    async (req, res) => {

        const { id } = req.params;

        try {
            //check if the order exists
            var is_order_exist = await Order.findOne({ _id: id });
            if (!is_order_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid order id`
                    }
                });
            }

            let deliveryVehicleId = is_order_exist.deliveryVehicleId.toString();

            // update order status
            let updatedOrder = await Order.findByIdAndUpdate({ _id: is_order_exist._id }, { isDelivered: true }, { new: true });

            if (!updatedOrder) {
                return res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to update order status`,
                    }
                });
            } else {
                // get the delivery vehicle and update the active orders count
                let deliveryVehicle = await DeliveryVehicle.findOne({ _id: deliveryVehicleId });
                let deliveryVehicleActiveOrders = deliveryVehicle.activeOrdersCount;
                let newdeliveryVehicleActiveOrders = deliveryVehicleActiveOrders - 1;

                await DeliveryVehicle.findByIdAndUpdate({ _id: deliveryVehicleId }, { activeOrdersCount: newdeliveryVehicleActiveOrders });

                return res.status(200).json({
                    status: 'success',
                    data: {
                        message: `order status updated successfully`,
                        vehicle: is_delivery_vehicle_exist
                    }
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]


exports.deleteNote = [

    async (req, res) => {

        const { id } = req.params;

        try {
            //check if the order exists
            var is_order_exist = await Order.findOne({ _id: id });
            if (!is_order_exist) {
                return res.status(409).json({
                    status: 'failed',
                    data: {
                        message: `enter a valid order id`
                    }
                });
            }

            let deliveryVehicleId = is_order_exist.deliveryVehicleId.toString();

            // update order status
            let updatedOrder = await Order.findByIdAndUpdate({ _id: is_order_exist._id }, { isDelivered: true }, { new: true });

            if (!updatedOrder) {
                return res.status(503).json({
                    status: 'fail',
                    data: {
                        message: `unable to update order status`,
                    }
                });
            } else {
                // get the delivery vehicle and update the active orders count
                let deliveryVehicle = await DeliveryVehicle.findOne({ _id: deliveryVehicleId });
                let deliveryVehicleActiveOrders = deliveryVehicle.activeOrdersCount;
                let newdeliveryVehicleActiveOrders = deliveryVehicleActiveOrders - 1;

                await DeliveryVehicle.findByIdAndUpdate({ _id: deliveryVehicleId }, { activeOrdersCount: newdeliveryVehicleActiveOrders });

                return res.status(200).json({
                    status: 'success',
                    data: {
                        message: `order status updated successfully`,
                        vehicle: is_delivery_vehicle_exist
                    }
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: 'fail',
                message: 'invalid data sent'
            });
        }
    }
]