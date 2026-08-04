const QUOTA_IMPORT_PATTERN =
    /^Import would exceed quota: (\d+) requested, (\d+) slots remaining \(used (\d+)\/(\d+)\)\.?$/;
const QUOTA_REACHED_PATTERN = /^Social media account quota reached \((\d+)\/(\d+)\)\./;

function extractRawError(error) {
    return error?.data?.message || error?.data?.error || error?.error || "";
}

function translateApiError(error, t) {
    const raw = extractRawError(error);
    if (!raw) return raw;

    let match;
    if ((match = raw.match(QUOTA_IMPORT_PATTERN))) {
        return t(
            "Import would exceed quota: {{requested}} requested, {{remaining}} slots remaining (used {{used}}/{{limit}}).",
            { requested: match[1], remaining: match[2], used: match[3], limit: match[4] },
        );
    }
    if ((match = raw.match(QUOTA_REACHED_PATTERN))) {
        return t(
            "Social media account quota reached ({{used}}/{{limit}}). Contact your administrator to increase it.",
            { used: match[1], limit: match[2] },
        );
    }
    return raw;
}

export default translateApiError;
