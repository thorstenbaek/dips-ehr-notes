const TOP_POS = 62;
const clip_rect = (rect, width, height) => {
    
    const BOTTOM_POS = height - 36;

    if (rect.bottom < TOP_POS) {
        return null;
    }
    if (rect.top < TOP_POS) {
        return new DOMRect(rect.left, TOP_POS, rect.width, rect.bottom - TOP_POS);
    }

    if (rect.top > BOTTOM_POS) {
        return null;
    }

    if (rect.bottom >= BOTTOM_POS) {
        return new DOMRect(rect.left, rect.top, rect.width, BOTTOM_POS - rect.top);
    }


    return rect;
}


export {clip_rect};