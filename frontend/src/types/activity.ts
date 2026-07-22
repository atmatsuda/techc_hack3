export type ActivityType =
  | ""
  | "walking"
  | "running"
  | "training"
  | "study"
  | "work"
  | "other";

export type SelectedActivityType =
  Exclude<ActivityType, "">;

export type ActivityFormData = {
  steps: string;
  heartRate: string;
  studyMinutes: string;
  sleepHours: string;
  activityType: ActivityType;
  memo: string;
};

export type ActivityPayload = {
  steps: number;
  heart_rate: number | null;
  study_minutes: number;
  sleep_hours: number;
  activity_type: SelectedActivityType;
  memo?: string;
};

export type CharacterStatus = {
  name: string;
  title: string;
  level: number;

  hp: number;
  maxHp: number;

  strength: number;
  maxStrength: number;

  intelligence: number;
  maxIntelligence: number;

  experience: number;
  nextLevelExperience: number;

  condition: string;
};

export type StatusCalculationResponse = {
  hp_gain: number;
  strength_gain: number;
  intelligence_gain: number;
  experience_gain: number;

  condition:
    | "excellent"
    | "good"
    | "normal"
    | "tired";

  condition_label: string;
};

export type AnalysisResult = {
  title: string;
  summary: string;
  good_points: string[];
  advice: string[];
  recommended_action: string;
};

export type MessageType =
  | ""
  | "success"
  | "error";