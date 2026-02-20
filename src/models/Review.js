import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    driverReply: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    driverReplyAt: {
      type: Date,
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    /* ⭐ US 12 — Validation employé */
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* -------------------------------------------------------
   ⭐ HOOK : recalcul automatique de la note du conducteur
------------------------------------------------------- */
reviewSchema.post("save", async function () {
  const Review = this.constructor;
  const User = mongoose.model("User");

  const reviews = await Review.find({ driver: this.driver, isApproved: true });

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const count = reviews.length;
  const average = count > 0 ? total / count : 0;

  await User.findByIdAndUpdate(this.driver, {
    driverTotalRating: total,
    driverReviewsCount: count,
    driverRating: average.toFixed(2),
  });
});

/* -------------------------------------------------------
   ⭐ HOOK : recalcul après suppression
------------------------------------------------------- */
reviewSchema.post("deleteOne", { document: true }, async function () {
  const Review = this.constructor;
  const User = mongoose.model("User");

  const reviews = await Review.find({ driver: this.driver, isApproved: true });

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const count = reviews.length;
  const average = count > 0 ? total / count : 0;

  await User.findByIdAndUpdate(this.driver, {
    driverTotalRating: total,
    driverReviewsCount: count,
    driverRating: average.toFixed(2),
  });
});

/* -------------------------------------------------------
   📌 Index pour accélérer les recherches
------------------------------------------------------- */
reviewSchema.index({ driver: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ ride: 1 });

export default mongoose.model("Review", reviewSchema);
