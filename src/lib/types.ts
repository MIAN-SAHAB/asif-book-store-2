export type SchoolId =
  | "city-school"
  | "beaconhouse"
  | "roots"
  | "lgs"
  | "educators"
  | "allied";

export interface School {
  id: SchoolId;
  name: string;
  short: string;
  /** Accent colour used for the school's badge. */
  color: string;
  featured?: boolean;
}

export type Stage = "early" | "primary" | "middle" | "senior";

export type GradeId =
  | "pg"
  | "nursery"
  | "kg"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "c8"
  | "o-level"
  | "a-level";

export interface Grade {
  id: GradeId;
  label: string;
  short: string;
  stage: Stage;
}

export type BookKind = "course-pack" | "o-a-level" | "revision" | "children";
export type UniformKind = "shirt" | "trousers" | "blazer" | "sash" | "tie" | "pe-kit";
export type ArtKind = BookKind | UniformKind | "bundle";

interface BaseProduct {
  id: string;
  name: string;
  price: number;
  /** Empty array = suitable for every school. */
  schools: SchoolId[];
  description: string;
  /** Primary colour used to draw the product avatar. */
  tone: string;
  /** Secondary colour (stripes, trims, logo) for the avatar. */
  accent?: string;
  tag?: string;
}

export interface BookProduct extends BaseProduct {
  category: "books";
  kind: BookKind;
  grades: GradeId[];
}

export interface UniformProduct extends BaseProduct {
  category: "uniforms";
  kind: UniformKind;
  stages: Stage[];
  sizes: string[];
}

export type Product = BookProduct | UniformProduct;

export interface CourseBundle {
  id: string;
  name: string;
  school: School;
  grade: Grade;
  subjects: string[];
  price: number;
}

export interface CartLine {
  /** Unique per product + size. */
  key: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  kind: ArtKind;
  tone: string;
  accent?: string;
  meta?: string;
}

export type CartLineInput = Omit<CartLine, "key" | "qty">;
