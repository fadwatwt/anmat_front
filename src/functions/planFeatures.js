export const getPlanFeatureTitle = (feature, fallback = "Feature") =>
  feature?.plan_feature?.title ||
  feature?.feature_type?.title ||
  feature?.feature_type_id?.title ||
  feature?.title ||
  fallback;

export const getPlanFeatureValue = (feature) => {
  const propValues = (feature?.properties || []).map((p) => p.value);
  const hasFormattedValue = propValues.some(
    (v) => typeof v === "string" && v.trim() !== "" && isNaN(Number(v)),
  );
  if (hasFormattedValue) return propValues.join(" · ");
  const details = feature?.plan_feature?.details || feature?.details || "";
  if (details && /\d/.test(details) && details.length < 40) return details;
  return propValues.join(" · ");
};
