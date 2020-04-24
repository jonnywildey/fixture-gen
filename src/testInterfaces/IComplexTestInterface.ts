

export interface IApplicationPropertyDTO {
  // id here refers to the id of a record that exists in the base property table
  id?: string;
  propertyType?: Property;
  construction?: Construction;
  purchasePrice?: number;
  tenure?: Tenure;
  isNewBuild?: boolean;
  isFirstOwner?: boolean;
  governmentScheme?: GovernmentScheme;
  numberOfBedrooms?: number;
  intendedUsage?: Usage;
  intendedUsageOther?: string;
  currentUsage?: Usage;
  currentUsageOther?: string;
  notes?: string;
  hasMortgage?: boolean;
  exLocalAuthority?: boolean;
  secondaryResidenceUsage?: string;
  currentValuation?: number;
  address?: IProperty;
  rent?: IRent;
  flat?: IFlat;
  sharedOwnership?: ISharedOwnership;
  leasehold?: ILeasehold;
  charges?: ICharges;
  createdOn: string;
  updatedOn?: string;
  editReason?: string;
  editedByStaffId?: string;
}

export interface IRent {
  tenancyAgreement?: TenancyAgreement | null;
  tenancyAgreementOther?: string | null;
  monthlyRent?: number | null;
  rentCoversExpenses?: boolean | null;
  isRentedToFamilyMember?: boolean | null;
  haveApplicantsLivedInProperty?: boolean | null;
  isOwnedUnderLimitedCompany?: boolean | null;
  hasLimitedCompanyOtherDirectors?: boolean | null;
  lengthOfTenancyMonths?: LengthOfTenancy | null;
  lengthOfTenancyMonthsOther?: string | null;
}

export interface IProperty {
  id?: string;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
}

export interface IFlat {
  storeys?: number;
  buildingFloor?: number;
  hasLift?: boolean;
  isAboveCommercialProperty?: boolean;
  businessNature?: Business;
  businessNatureOther?: string;
  deckAccess?: boolean;
  isStudioFlatOver30SquareMetres?: boolean;
}

export interface ISharedOwnership {
  ownsFullShare?: boolean;
  percentShare?: number;
  canIncreaseShare?: boolean;
  canIncreaseShareUnknown?: boolean;
  potentialShare?: number;
  priceShare?: number;
  housingAssociation?: string;
  housingAssociationUnknown?: boolean;
  housingAssociationRent?: number;
  housingAssociationRentUnknown?: boolean;
  wantsIncreaseShare?: boolean;
  targetIncreaseShare?: number;
}

export interface ILeasehold {
  remainingLease?: string;
  remainingLeaseEstimate?: boolean;
}

export interface ICharges {
  annualGroundRent?: number;
  annualGroundRentEstimated?: boolean;
  annualServiceCharge?: number;
  annualServiceChargeEstimated?: boolean;
}

// ENUMS

export enum Usage {
  MAIN_RESIDENCE = "MAIN_RESIDENCE",
  SECONDARY_RESIDENCE = "SECONDARY_RESIDENCE",
  RENTING_OUT = "RENTING_OUT",
  HOLIDAY_LET = "HOLIDAY_LET",
  OTHER = "OTHER",
}

export enum Owner {
  MAIN_APPLICANT = "MAIN_APPLICANT",
  DUAL_APPLICANT = "DUAL_APPLICANT",
  JOINT_MAIN_DUAL = "JOINT_MAIN_DUAL",
  JOINT_MAIN_OTHER = "JOINT_MAIN_OTHER",
  JOINT_DUAL_OTHER = "JOINT_DUAL_OTHER",
}

export enum TenancyAgreement {
  AST_AGREEMENT = "AST_AGREEMENT",
  COMPANY_LET_AGREEMENT = "COMPANY_LET_AGREEMENT",
  DSS_TENANCY_AGREEMENT = "DSS_TENANCY_AGREEMENT",
  OTHER = "OTHER",
}

export enum Property {
  STANDARD_FLAT = "STANDARD_FLAT",
  STUDIO_FLAT = "STUDIO_FLAT",
  MAISONETTE = "MAISONETTE",
  DETACHED_HOUSE = "DETACHED_HOUSE",
  SEMI_DETACHED_HOUSE = "SEMI_DETACHED_HOUSE",
  TERRACED_HOUSE = "TERRACED_HOUSE",
  BUNGALOW = "BUNGALOW",
}

export enum Construction {
  STANDARD = "STANDARD",
  BARN_CONVERSION = "BARN_CONVERSION",
  PRECAST_CONCRETE = "PRECAST_CONCRETE",
  STEEL_FRAMED = "STEEL_FRAMED",
  THATCHED = "THATCHED",
  TIMBER_FRAMED = "TIMBER_FRAMED",
}

export enum Tenure {
  LEASEHOLD = "LEASEHOLD",
  FREEHOLD = "FREEHOLD",
  COMMONHOLD = "COMMONHOLD",
  FLYING_FREEHOLD = "FLYING_FREEHOLD",
  FEUHOLD = "FEUHOLD",
  SHARE_OF_FREEHOLD = "SHARE_OF_FREEHOLD",
}

export enum Business {
  BARS_PUBLIC_HOUSE = "BARS_PUBLIC_HOUSE",
  CAFE_RESTAURANT_TAKEAWAY = "CAFE_RESTAURANT_TAKEAWAY",
  LAUNDRETTE = "LAUNDRETTE",
  SHOP_RETAIL = "SHOP_RETAIL",
  HAIRDRESSER = "HAIRDRESSER",
  OFFICE_SPACE = "OFFICE_SPACE",
  TAXI_RANK = "TAXI_RANK",
  OTHER = "OTHER",
}

export enum GovernmentScheme {
  HELP_TO_BUY_EQUITY_LOAN = "HELP_TO_BUY_EQUITY_LOAN",
  HELP_TO_BUY_LONDON = "HELP_TO_BUY_LONDON",
  HELP_TO_BUY_MORTGAGE_GUARANTEE = "HELP_TO_BUY_MORTGAGE_GUARANTEE",
  NO = "NO",
  RIGHT_TO_BUY = "RIGHT_TO_BUY",
  SHARED_OWNERSHIP = "SHARED_OWNERSHIP",
}

export enum LengthOfTenancy {
  THREE_MONTHS = "3",
  SIX_MONTHS = "6",
  TWELVE_MONTHS = "12",
  TWENTY_FOUR_MONTHS = "24",
  THIRTY_SIX_MONTHS = "36",
  OTHER = "Other",
}
