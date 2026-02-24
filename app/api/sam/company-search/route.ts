import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * SAM.gov public web API endpoint (no API key required)
 * Uses the /sgs/v1/search/ endpoint with index=opp (opportunities)
 * Then extracts unique organizations/companies from award data
 */
const SAM_SEARCH_URL = "https://sam.gov/api/prod/sgs/v1/search/";

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
  samSearchUrl?: string;
  hasRealUei?: boolean;
  // Certifications / set-asides
  sbaBusinessTypes?: string[];
  isSmallBusiness?: boolean;
  isWomanOwned?: boolean;
  isVeteranOwned?: boolean;
  isServiceDisabledVeteranOwned?: boolean;
  isHubZone?: boolean;
  is8aProgram?: boolean;
  // Related contracts (from opportunity search)
  relatedOpportunities?: Array<{
    noticeId: string;
    title: string;
    type?: string;
    postedDate?: string;
    naicsCode?: string;
    awardAmount?: number;
    awardDate?: string;
    department?: string;
    uiLink: string;
  }>;
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

    // SAM.gov entity search requires authentication (index=ent returns 401)
    // Workaround: Search award notices on the public opportunity API (index=opp)
    // and extract unique awardee companies from the results
    const urlParams: Record<string, string> = {
      index: "opp",
      limit: String(Math.min(limit, 100)),
      page: String(page),
      sort: "-modifiedDate",
      random: String(Date.now()),
    };

    // Search by company name / keyword
    if (keyword.trim()) {
      urlParams.q = keyword.trim();
    } else {
      // Without a keyword, search for award notices to get awardee companies
      urlParams.notice_type = "a";  // "a" = Award Notice
    }

    // State filter (place of performance)
    if (state) {
      urlParams.pop_state = state.toUpperCase();
    }

    // NAICS code filter
    if (naicsCode) {
      urlParams.naics = naicsCode.trim();
    }

    let url = SAM_SEARCH_URL + "?";
    Object.keys(urlParams).forEach((key) => {
      url += `${key}=${encodeURIComponent(urlParams[key])}&`;
    });
    url = url.slice(0, -1);

    console.log("[Company Search] Using opportunity search to find companies:", url);

    const response = await fetch(url, { method: "GET", headers: SAM_HEADERS });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Company Search] SAM.gov error:", response.status, url);
      console.error("[Company Search] SAM.gov response body:", text.substring(0, 500));
      return NextResponse.json(
        { error: `SAM.gov returned ${response.status}`, details: text.substring(0, 300) },
        { status: 502 }
      );
    }

    const data = await response.json();
    const opportunities: any[] = data._embedded?.results || [];

    // Extract unique companies from opportunity data
    // Look for: award.awardee, organizationHierarchy, pointOfContacts, etc.
    const companyMap = new Map<string, SamCompany>();

    for (const opp of opportunities) {
      const noticeId = opp.noticeId || opp._id || "";
      const naicsCode = extractNaicsFromOpp(opp);

      // Build org hierarchy label
      const orgArray: any[] = Array.isArray(opp.organizationHierarchy) ? opp.organizationHierarchy : [];
      const department = orgArray.find((h: any) => h.level === 1)?.name || orgArray[0]?.name || "";

      // Type label
      const typeObj = opp.type;
      const typeLabel = typeof typeObj === "object" ? typeObj?.value || typeObj?.code : typeObj;

      // Build the related opportunity entry
      const relatedOpp = {
        noticeId,
        title: opp.title || "Untitled",
        type: typeLabel,
        postedDate: opp.postedDate || opp.publishDate,
        naicsCode,
        awardAmount: opp.award?.amount ? Number(opp.award.amount) : undefined,
        awardDate: opp.award?.date,
        department,
        uiLink: opp.uiLink || `https://sam.gov/opp/${noticeId}/view`,
      };

      // Extract from award data (awardee = company that won the contract)
      const award = opp.award;
      if (award?.awardee) {
        const awardee = award.awardee;
        const realUei = awardee.ueiSAM || awardee.uei;
        const name = awardee.name || awardee.legalBusinessName || "Unknown";
        const mapKey = realUei || name;

        if (mapKey) {
          if (!companyMap.has(mapKey)) {
            companyMap.set(mapKey, {
              ueiSAM: realUei || "",
              legalBusinessName: name,
              hasRealUei: !!realUei,
              // Always use search URL - the direct /entity/{uei}/core-data path returns 404
              // Searching by UEI returns the exact entity match
              samUrl: realUei
                ? `https://sam.gov/search?index=ent&q=${encodeURIComponent(realUei)}`
                : `https://sam.gov/search?index=ent&q=${encodeURIComponent(name)}`,
              samSearchUrl: `https://sam.gov/search?index=ent&q=${encodeURIComponent(name)}`,
              registrationStatus: "Active",
              naicsCode,
              cageCode: awardee.cageCode || undefined,
              physicalAddress: awardee.location || awardee.address ? {
                addressLine1: (awardee.location || awardee.address)?.streetAddress,
                city: (awardee.location || awardee.address)?.city?.name || (awardee.location || awardee.address)?.city,
                stateOrProvinceCode: (awardee.location || awardee.address)?.state?.code || (awardee.location || awardee.address)?.state,
                zipCode: (awardee.location || awardee.address)?.zip || (awardee.location || awardee.address)?.zipCode,
                countryCode: (awardee.location || awardee.address)?.country?.code || (awardee.location || awardee.address)?.country,
              } : undefined,
              relatedOpportunities: noticeId ? [relatedOpp] : [],
            });
          } else {
            // Append this opportunity to existing company
            const existing = companyMap.get(mapKey)!;
            if (noticeId && !existing.relatedOpportunities?.find(r => r.noticeId === noticeId)) {
              existing.relatedOpportunities = [...(existing.relatedOpportunities || []), relatedOpp];
            }
          }
        }
      }
    }

    // Convert map to array and apply additional filters
    let companies = Array.from(companyMap.values());

    // Filter by business type keywords if specified
    if (businessTypes.length > 0) {
      const typeKeywords = businessTypes.flatMap((code) => {
        const keywords: Record<string, string[]> = {
          A2: ["small business", "small"],
          A5: ["woman", "women", "wosb"],
          QF: ["veteran", "vet"],
          A6: ["service disabled", "sdvosb"],
          XX: ["hubzone", "hub zone"],
          "27": ["8a", "8(a)"],
        };
        return keywords[code] || [];
      });
      
      companies = companies.filter((c) =>
        typeKeywords.some((kw) =>
          c.legalBusinessName.toLowerCase().includes(kw) ||
          (c.entityStructure?.toLowerCase() || "").includes(kw)
        )
      );
    }

    // Sort by company name
    companies.sort((a, b) => a.legalBusinessName.localeCompare(b.legalBusinessName));

    // Apply pagination
    const total = companies.length;
    const start = page * limit;
    const paginated = companies.slice(start, start + limit);

    return NextResponse.json({
      companies: paginated,
      total,
      page,
      query: { keyword, state, naicsCode, entityTypes, businessTypes, registrationStatus },
      _note: "Results extracted from opportunity award data. For full SAM.gov entity search, an API key is required.",
    });
  } catch (error) {
    console.error("[Company Search] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

// Helper to extract NAICS from opportunity data
function extractNaicsFromOpp(opp: any): string | undefined {
  const naicsArr: any[] = Array.isArray(opp.naics) ? opp.naics
    : Array.isArray(opp.naicsCode) ? opp.naicsCode
    : Array.isArray(opp.naicsCodes) ? opp.naicsCodes : [];
  return naicsArr[0]?.code || (typeof opp.naicsCode === "string" ? opp.naicsCode : undefined);
}
