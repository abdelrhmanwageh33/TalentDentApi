import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      notes: {
        type: String,
        default: "",
      },
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order= mongoose.model("Order", OrderSchema);
export default Order
