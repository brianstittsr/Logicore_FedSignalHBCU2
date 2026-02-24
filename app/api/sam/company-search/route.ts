import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * SAM.gov Entity Management API v3 (official, requires free API key)
 * Docs: https://open.gsa.gov/api/entity-api/
 * Get a free key: https://sam.gov → Sign In → Account Details → Public API Key
 */
const SAM_ENTITY_API_URL = "https://api.sam.gov/entity-information/v3/entities";

const SAM_HEADERS = {
  Accept: "application/json",
  "User-Agent": "SamGovApiServer/1.0.0",
};

export interface CompanySearchParams {
  keyword?: string;
  state?: string;
  naicsCode?: string;
  entityTypes?: string[];
  businessTypes?: string[];
  registrationStatus?: "active" | "inactive" | "all";
  limit?: number;
  page?: number;
}

export interface SamCompany {
  ueiSAM: string;
  legalBusinessName: string;
  dbaName?: string;
  registrationStatus?: string;
  registrationExpirationDate?: string;
  activationDate?: string;
  lastUpdateDate?: string;
  ueiStatus?: string;
  entityStructure?: string;
  entityType?: string;
  organizationType?: string;
  businessTypes?: string[];
  naicsCode?: string;
  naicsCodes?: string[];
  primaryNaics?: string;
  physicalAddress?: {
    addressLine1?: string;
    city?: string;
    stateOrProvinceCode?: string;
    zipCode?: string;
    countryCode?: string;
  };
  mailingAddress?: {
    addressLine1?: string;
    city?: string;
    stateOrProvinceCode?: string;
    zipCode?: string;
    countryCode?: string;
  };
  pointOfContact?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  cageCode?: string;
  dodaac?: string;
  samUrl?: string;
  // Certifications / set-asides
  sbaBusinessTypes?: string[];
  isSmallBusiness?: boolean;
  isWomanOwned?: boolean;
  isVeteranOwned?: boolean;
  isServiceDisabledVeteranOwned?: boolean;
  isHubZone?: boolean;
  is8aProgram?: boolean;
}

function transformEntityResult(raw: any): SamCompany {
  const entity = raw.entity || raw;
  const regInfo = entity.registrationDetails || entity.registration || entity;
  const coreData = entity.coreData || entity;
  const assertions = entity.assertions || entity;

  const physAddr =
    coreData.physicalAddress ||
    regInfo.physicalAddress ||
    entity.physicalAddress ||
    raw.physicalAddress;

  const mailingAddr =
    coreData.mailingAddress ||
    regInfo.mailingAddress ||
    entity.mailingAddress;

  // NAICS codes
  const naicsArr: any[] = coreData.naicsCode || regInfo.naicsCode || entity.naicsCodes || [];
  const primaryNaics =
    (Array.isArray(naicsArr) ? naicsArr.find((n: any) => n.isPrimary || n.primary)?.naicsCode || naicsArr[0]?.naicsCode || naicsArr[0] : naicsArr) ||
    raw.naicsCode ||
    "";

  // Business / entity type
  const entityStructure =
    coreData.entityStructure?.description ||
    coreData.entityStructure ||
    regInfo.entityStructure ||
    raw.entityStructure ||
    "";

  const businessTypes: string[] = [];
  const rawBiz: any[] = assertions.goodsAndServices?.businessTypeList || coreData.businessTypeList || regInfo.businessTypes || [];
  rawBiz.forEach((b: any) => {
    const desc = b.businessTypeDescription || b.description || b;
    if (desc) businessTypes.push(String(desc));
  });

  // SBA certifications
  const certList: any[] = assertions.certifications?.sbaBusinessProgramsList || [];
  const certNames = certList.map((c: any) => c.sbaBusinessProgramDescription || c.description || "");
  const isSmallBusiness = certNames.some((c) => /small business/i.test(c)) || businessTypes.some((b) => /small business/i.test(b));
  const isWomanOwned = certNames.some((c) => /wosb|woman/i.test(c)) || businessTypes.some((b) => /wosb|woman/i.test(b));
  const isVeteranOwned = certNames.some((c) => /veteran/i.test(c)) || businessTypes.some((b) => /veteran/i.test(b));
  const isServiceDisabledVeteranOwned = certNames.some((c) => /service.disabled/i.test(c)) || businessTypes.some((b) => /service.disabled/i.test(b));
  const isHubZone = certNames.some((c) => /hubzone/i.test(c));
  const is8aProgram = certNames.some((c) => /8\(a\)|8a/i.test(c));

  const ueiSAM =
    raw.ueiSAM || raw._id || entity.ueiSAM || regInfo.ueiSAM || coreData.ueiSAM || "";

  return {
    ueiSAM,
    legalBusinessName:
      raw.legalBusinessName ||
      coreData.legalBusinessName ||
      regInfo.legalBusinessName ||
      entity.legalBusinessName ||
      "Unknown",
    dbaName:
      raw.dbaName || coreData.dbaName || regInfo.dbaName || undefined,
    registrationStatus:
      raw.registrationStatus ||
      regInfo.registrationStatus ||
      entity.registrationStatus ||
      undefined,
    registrationExpirationDate:
      regInfo.registrationExpirationDate ||
      entity.registrationExpirationDate ||
      undefined,
    activationDate: regInfo.activationDate || entity.activationDate || undefined,
    lastUpdateDate: raw.lastModifiedDate || regInfo.lastUpdateDate || undefined,
    entityStructure: String(entityStructure),
    businessTypes,
    naicsCode: String(primaryNaics) || undefined,
    naicsCodes: Array.isArray(naicsArr)
      ? naicsArr.map((n: any) => n.naicsCode || n).filter(Boolean).map(String)
      : [],
    primaryNaics: String(primaryNaics) || undefined,
    physicalAddress: physAddr
      ? {
          addressLine1: physAddr.addressLine1 || physAddr.streetAddress || undefined,
          city: physAddr.city?.name || physAddr.city || undefined,
          stateOrProvinceCode:
            physAddr.stateOrProvinceCode ||
            physAddr.state?.code ||
            physAddr.state ||
            undefined,
          zipCode: physAddr.zipCode || physAddr.zip || undefined,
          countryCode:
            physAddr.countryCode ||
            physAddr.country?.code ||
            physAddr.country ||
            undefined,
        }
      : undefined,
    mailingAddress: mailingAddr
      ? {
          addressLine1: mailingAddr.addressLine1 || undefined,
          city: mailingAddr.city?.name || mailingAddr.city || undefined,
          stateOrProvinceCode:
            mailingAddr.stateOrProvinceCode ||
            mailingAddr.state?.code ||
            mailingAddr.state ||
            undefined,
          zipCode: mailingAddr.zipCode || mailingAddr.zip || undefined,
        }
      : undefined,
    cageCode: raw.cageCode || regInfo.cageCode || undefined,
    samUrl: `https://sam.gov/entity/${ueiSAM}/core-data`,
    sbaBusinessTypes: certNames.filter(Boolean),
    isSmallBusiness,
    isWomanOwned,
    isVeteranOwned,
    isServiceDisabledVeteranOwned,
    isHubZone,
    is8aProgram,
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.SAM_GOV_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "SAM.gov API key not configured",
        missingApiKey: true,
        details: "Add SAM_GOV_API_KEY to .env.local — get a free key at sam.gov → Sign In → Account Details → Public API Key",
      },
      { status: 503 }
    );
  }

  try {
    const body: CompanySearchParams = await request.json();
    const {
      keyword = "",
      state,
      naicsCode,
      entityTypes = [],
      businessTypes = [],
      registrationStatus = "active",
      limit = 100,
      page = 0,
    } = body;

    /**
     * SAM.gov Entity Management API v3 query params
     * Docs: https://open.gsa.gov/api/entity-api/
     *
     * Key fields:
     *   api_key          — required
     *   entityName       — company name keyword search
     *   physicalAddressStateOrProvinceCode — 2-letter state
     *   naicsCode        — 6-digit NAICS
     *   entityStructureCode — comma-separated entity structure codes (2L, 8H, 2J, MF, 2A, 2I, 2S, 8W)
     *   businessTypeCode — comma-separated SBA business type codes (A2, A5, QF, A6, XX, 27)
     *   registrationStatus — "A" (active) | "E" (expired/inactive)
     *   includeSections  — what data to return
     *   size             — number of results
     *   page             — 0-based page number
     */
    const params = new URLSearchParams();
    params.set("api_key", apiKey);
    params.set("includeSections", "entityRegistration,coreData,assertions,repsAndCerts");
    params.set("size", String(Math.min(limit, 100)));
    params.set("page", String(page));

    if (keyword.trim()) {
      params.set("entityName", keyword.trim());
    }
    if (state) {
      params.set("physicalAddressStateOrProvinceCode", state.toUpperCase());
    }
    if (naicsCode) {
      params.set("naicsCode", naicsCode.trim());
    }
    if (registrationStatus === "active") {
      params.set("registrationStatus", "A");
    } else if (registrationStatus === "inactive") {
      params.set("registrationStatus", "E");
    }
    if (entityTypes.length > 0) {
      params.set("entityStructureCode", entityTypes.join("~"));
    }
    if (businessTypes.length > 0) {
      params.set("businessTypeCode", businessTypes.join("~"));
    }

    const url = `${SAM_ENTITY_API_URL}?${params.toString()}`;
    console.log("[Company Search] URL:", url.replace(apiKey, "***"));

    const response = await fetch(url, { method: "GET", headers: SAM_HEADERS });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Company Search] SAM.gov error:", response.status, text.substring(0, 300));
      return NextResponse.json(
        { error: `SAM.gov returned ${response.status}`, details: text.substring(0, 200) },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Entity API v3 response shape: { entityData: [...], totalRecords: N, ... }
    const rawResults: any[] = data.entityData || [];
    const total: number = data.totalRecords || rawResults.length;

    const companies: SamCompany[] = rawResults.map(transformEntityResult);

    return NextResponse.json({
      companies,
      total,
      page,
      query: { keyword, state, naicsCode, entityTypes, businessTypes, registrationStatus },
    });
  } catch (error) {
    console.error("[Company Search] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
