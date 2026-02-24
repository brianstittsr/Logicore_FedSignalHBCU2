import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SAM_ENTITY_SEARCH_URL = "https://sam.gov/api/prod/sgs/v1/search/";

const SAM_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
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

    // Build SAM.gov entity search URL params (index=ent)
    const urlParams: Record<string, string> = {
      index: "ent",
      limit: String(Math.min(limit, 200)),
      page: String(page),
      sort: "-lastModifiedDate",
      random: String(Date.now()),
    };

    if (keyword.trim()) {
      urlParams.q = keyword.trim();
    }

    // Physical address state filter — maps to sam.gov physicalAddress.stateOrProvinceCode
    if (state) {
      urlParams["physicalAddress.stateOrProvinceCode"] = state.toUpperCase();
    }

    // NAICS code filter
    if (naicsCode) {
      urlParams.naicsCode = naicsCode.trim();
    }

    // Registration / entity status
    if (registrationStatus === "active") {
      urlParams.registration_status = "A";
    } else if (registrationStatus === "inactive") {
      urlParams.registration_status = "E";
    }

    // Entity type filters from the attachments:
    // Corporate Entity Not Tax Exempt, LLC, S-Corp, Manufacturer of Goods, For Profit, Partnership, Sole Proprietorship
    if (entityTypes.length > 0) {
      urlParams.entity_structure = entityTypes.join(",");
    }

    // Business type / set-aside (SBA types)
    if (businessTypes.length > 0) {
      urlParams.bus_type = businessTypes.join(",");
    }

    let url = SAM_ENTITY_SEARCH_URL + "?";
    Object.keys(urlParams).forEach((key) => {
      url += `${key}=${encodeURIComponent(urlParams[key])}&`;
    });
    url = url.slice(0, -1);

    console.log("[Company Search] URL:", url);

    const response = await fetch(url, { method: "GET", headers: SAM_HEADERS });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Company Search] SAM.gov error:", response.status, text.substring(0, 300));
      return NextResponse.json(
        { error: `SAM.gov returned ${response.status}`, details: text.substring(0, 200) },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawResults: any[] = data._embedded?.results || [];
    const total: number = data.page?.totalElements || rawResults.length;

    // Filter to entity results only (exclude opportunities that might slip through)
    const entityResults = rawResults.filter((r: any) => {
      const type = r._samdotgovType || r._type || "";
      return type === "entity" || type === "" || r.legalBusinessName || r.ueiSAM;
    });

    const companies: SamCompany[] = entityResults.map(transformEntityResult);

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
