export interface CatalogItem {
    id: string;
    name: string;
    subCategoryId: string;
    price: number; // Decimal in DB becomes string/number in JSON
    unit: string;
    options: string | null; // JSON string
}

export interface CatalogSubCategory {
    id: string;
    name: string;
    items: CatalogItem[];
}

export interface CatalogCategory {
    id: string;
    name: string;
    description: string | null;
    subCategories: CatalogSubCategory[];
}

export interface QuoteItem {
    serviceItemId: string;
    quantity: number;
    notes?: string;

    // Enriched for UI
    item?: CatalogItem;
}

export interface QuoteDraft {
    eventId?: string;
    eventName: string;
    guestCount: number;
    date: string;

    selectedItems: QuoteItem[];
}
