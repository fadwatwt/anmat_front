import i18n from "i18next";
import { getPermissionLabel } from "../permissionTranslations";

describe("permission translations", () => {
  beforeAll(async () => {
    if (!i18n.isInitialized) {
      await i18n.init({ lng: "ar", resources: {} });
    } else {
      await i18n.changeLanguage("ar");
    }
  });

  test.each([
    ["social_media_actions.delete_post", "حذف منشورات"],
    ["social_media_actions.reply", "الرد على منشورات"],
    ["social_media_categories.list", "عرض فئات الحسابات"],
    ["social_media_analytics.view", "عرض تحليلات التواصل الاجتماعي"],
    ["attachments.upload", "رفع المرفقات"],
    ["attachments.delete", "حذف المرفقات"],
    ["notifications.create", "إرسال إشعار"],
    ["roles.assign", "إسناد دور"],
    ["roles.unassign", "سحب دور"],
  ])("translates %s", (permission, expected) => {
    expect(getPermissionLabel(permission, { name: permission })).toBe(expected);
  });
});
