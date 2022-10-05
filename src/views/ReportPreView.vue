<script setup lang="ts">
import * as cis from "@/cis-r";
import ResultSheet from "@/components/ResultSheet.vue";

const item_data = [
  {
    question_id: "health-appetite-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "health-appetite-gain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-pain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-discomfort",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue-energy",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "concentration-forgetting",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-gain",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "I have slept more than usual but this is not a problem",
      },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "Yes, I have felt irritable or short tempered recently",
      },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability-trivial",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria-serious",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-enjoy",
    answers: [
      { value: 1, text: "Yes" },
      { value: 2, text: "No, less enjoyment than usual" },
      { value: 3, text: "No, I don't enjoy anything" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-enjoy-recent",
    answers: [
      { value: 1, text: "Yes" },
      { value: 2, text: "No, less enjoyment than usual" },
      { value: 3, text: "No, I don't enjoy anything" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-duration",
    answers: [
      { value: 1, text: "Less than 2 weeks" },
      { value: 2, text: "Between 2 weeks and 6 months" },
      { value: 3, text: "Between 6 months and 1 year" },
      { value: 4, text: "Between 1 and 2 years" },
      { value: 5, text: "Between 2 and 5 years" },
      { value: 6, text: "More than 5 years" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-detail-hopeless",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes, I have felt hopeless sometimes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry-any",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "anxiety-tense",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 1,
  },
  {
    question_id: "anxiety-phobia",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 1,
  },
  {
    question_id: "anxiety-phobia-only",
    answers: [
      {
        value: 1,
        text: "These feelings were ALWAYS brought on by specific phobia",
      },
      {
        value: 2,
        text: "I sometimes felt generally anxious, nervous or tense",
      },
    ],
    answer_index: 1,
  },
  {
    question_id: "anxiety-frequency",
    answers: [
      { value: 1, text: "None" },
      { value: 2, text: "Between one and three days" },
      { value: 3, text: "Four days or more" },
    ],
    answer_index: 2,
  },
  {
    question_id: "anxiety-duration",
    answers: [
      { value: 1, text: "Less than 2 weeks" },
      { value: 2, text: "Between 2 weeks and 6 months" },
      { value: 3, text: "Between 6 months and 1 year" },
      { value: 4, text: "Between 1 and 2 years" },
      { value: 5, text: "Between 2 and 5 years" },
      { value: 6, text: "More than 5 years" },
    ],
    answer_index: 4,
  },
  {
    question_id: "phobia-frequency",
    answers: [
      { value: 1, text: "None" },
      { value: 2, text: "Between one and three days" },
      { value: 3, text: "Four days or more" },
    ],
    answer_index: 1,
  },
  {
    question_id: "phobia-avoid",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes, on one or more occasion" },
    ],
    answer_index: 1,
  },
  {
    question_id: "phobia-avoid-frequency",
    answers: [
      { value: 1, text: "None" },
      { value: 2, text: "Between one and three times" },
      { value: 3, text: "Four times or more" },
    ],
    answer_index: 2,
  },
  {
    question_id: "phobia-duration",
    answers: [
      { value: 1, text: "Less than 2 weeks" },
      { value: 2, text: "Between 2 weeks and 6 months" },
      { value: 3, text: "Between 6 months and 1 year" },
      { value: 4, text: "Between 1 and 2 years" },
      { value: 5, text: "Between 2 and 5 years" },
      { value: 6, text: "More than 5 years" },
    ],
    answer_index: 2,
  },
  {
    question_id: "panic",
    answers: [
      { value: 1, text: "No, my anxiety never got that bad" },
      { value: 2, text: "Yes, sometimes" },
      { value: 3, text: "Yes, often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "compulsive",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 1,
  },
  {
    question_id: "compulsive-frequency",
    answers: [
      { value: 1, text: "None" },
      { value: 2, text: "Between one and three days" },
      { value: 3, text: "Four days or more" },
    ],
    answer_index: 2,
  },
  {
    question_id: "obsessive",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 1,
  },
  {
    question_id: "obsessive-repeat",
    answers: [
      { value: 1, text: "The same thoughts or ideas over and over again" },
      { value: 2, text: "Worrying about something in general" },
    ],
    answer_index: 1,
  },
  {
    question_id: "overall-follow-up",
    answers: [
      { value: 1, text: "Not at all" },
      {
        value: 2,
        text: "They have made things more difficult but I get everything done",
      },
      { value: 3, text: "They have stopped one activity" },
      { value: 4, text: "They have stopped more than one activity" },
    ],
    answer_index: 0,
  },
  {
    question_id: "health-appetite-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "health-appetite-gain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-pain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-discomfort",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue-energy",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "concentration-forgetting",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-gain",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "I have slept more than usual but this is not a problem",
      },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "Yes, I have felt irritable or short tempered recently",
      },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability-trivial",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria-serious",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-enjoy",
    answers: [
      { value: 1, text: "Yes" },
      { value: 2, text: "No, less enjoyment than usual" },
      { value: 3, text: "No, I don't enjoy anything" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry-any",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "anxiety-tense",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "phobia",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "compulsions",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "obsessions",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "health-appetite-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "health-appetite-gain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-pain",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "somatic-discomfort",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "fatigue-energy",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "concentration-forgetting",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-loss",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "sleep-gain",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "I have slept more than usual but this is not a problem",
      },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability",
    answers: [
      { value: 1, text: "No" },
      {
        value: 2,
        text: "Yes, I have felt irritable or short tempered recently",
      },
    ],
    answer_index: 0,
  },
  {
    question_id: "irritability-trivial",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "hypochondria-serious",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "depression-enjoy",
    answers: [
      { value: 1, text: "Yes" },
      { value: 2, text: "No, less enjoyment than usual" },
      { value: 3, text: "No, I don't enjoy anything" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "worry-any",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "anxiety-tense",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "phobia",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Yes" },
    ],
    answer_index: 0,
  },
  {
    question_id: "compulsions",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
  {
    question_id: "obsessions",
    answers: [
      { value: 1, text: "No" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Often" },
    ],
    answer_index: 0,
  },
];
const item_ids = item_data.map((i) => i.question_id);
const items = cis._state_properties.items.map((i) => {
  if (i.type === cis.ItemType.NUMBER) i.answer = { value: 42 };
  if (item_ids.includes(i.id))
    i.answer =
      i.answer_options[
        // @ts-ignore
        item_data.find((x) => x.question_id === i.id).answer_index
      ];
  return i;
});
const now = new Date();

const diagnoses = [
  "No diagnosis identified",
  "ICD10 Mixed anxiety & depressive disorder (mild)",
  "ICD10 Generalised anxiety disorder - mild",
  "ICD10 Obsessive-compulsive disorder",
  "ICD10 Mixed anxiety and depressive disorder",
  "ICD10 Specific (isolated) phobia",
  "ICD10 Social phobia",
  "ICD10 Agoraphobia",
  "ICD10 Generalised anxiety disorder",
  "ICD10 Panic disorder",
  "ICD10 Mild depressive episode",
  "ICD10 Moderate depressive episode",
  "ICD10 Severe depressive episode",
];

const impairment = [
  "None",
  "More difficult but everything gets done",
  "One activity stopped",
  "More than one activity stopped",
];
const imp = 2;

const outputs = {
  DIAG1: 11,
  DIAG2: 8,
};

const counters = {
  anxiety: 2,
  AN4: 1,
  panic: 2,
  phobia: 0,
  phobia_type: 0,
  obsessions: 1,
  compulsions: 2,
  depression_criterion_1: 3,
  depression_criterion_2: 3,
  depression_criterion_3: 3,
  NEURAS: 0,
  score: 16,
  somatic: 1,
  hypochondria: 2,
  irritability: 0,
  concentration: 0,
  fatigue: 0,
  sleep: 1,
  sleep_detail: 1,
  depression: 6,
  weight_detail: 0,
  depressive_ideas: 3,
  worry: 2,
};
const content = {
  summary: `
      <h1>CIS-R output</h1>
      <div class="datetime text-muted">
        <span class="date">${now.toLocaleDateString()}</span>
        <span class="time">${now.toLocaleTimeString()}</span>
      </div>
      <div class="disclaimer my-2 small">
        The results should only be used in conjunction with a clinical assessment
      </div>
      <ul class="major-output list-unstyled">
        <li class="d-flex">
          <strong class="label">Primary Diagnosis:</strong>
          <span class="value flex-grow-1 text-end">${
            diagnoses[outputs.DIAG1]
          }</span>
        </li>
        <li class="d-flex">
          <strong class="label">Secondary Diagnosis:</strong>
          <span class="value flex-grow-1 text-end">${
            diagnoses[outputs.DIAG2]
          }</span>
        </li>
        <li class="d-flex">
          <strong class="label">Total score:</strong>
          <span class="value flex-grow-1 text-end">${counters.score}</span>
        </li>
      </ul>
      <ul class="minor-output list-unstyled">
        <li class="d-flex ${counters.somatic > 2 ? "mark" : ""}">
          <strong class="label">Somatic symptoms:</strong>
          <span class="value flex-grow-1 text-end">${counters.somatic}</span>
        </li>
        <li class="d-flex ${counters.hypochondria > 2 ? "mark" : ""}">
          <strong class="label">Worry over Physical Health:</strong>
          <span class="value flex-grow-1 text-end">${
            counters.hypochondria
          }</span>
        </li>
        <li class="d-flex ${counters.irritability > 2 ? "mark" : ""}">
          <strong class="label">Irritability:</strong>
          <span class="value flex-grow-1 text-end">${
            counters.irritability
          }</span>
        </li>
        <li class="d-flex ${counters.concentration > 2 ? "mark" : ""}">
          <strong class="label">Poor concentration:</strong>
          <span class="value flex-grow-1 text-end">${
            counters.concentration
          }</span>
        </li>
        <li class="d-flex ${counters.fatigue > 2 ? "mark" : ""}">
          <strong class="label">Fatigue:</strong>
          <span class="value flex-grow-1 text-end">${counters.fatigue}</span>
        </li>
        <li class="d-flex flex-wrap ${counters.sleep > 2 ? "mark" : ""}">
          <strong class="label">Sleep problems:</strong>
          <span class="value flex-grow-1 text-end">${counters.sleep}</span>
        </li>
          <p class="detail small ms-4 my-0 text-justify${
            counters.sleep_detail ? "" : " d-none"
          }">
            ${
              counters.sleep_detail === 1
                ? "Patient reports early morning waking"
                : counters.sleep_detail === 2
                ? "Patient reports insomnia but not early morning waking"
                : "Patient reports sleeping more than usual"
            }
          </p>
        <li class="d-flex flex-wrap ${counters.depression > 2 ? "mark" : ""}">
          <strong class="label">Depression:</strong>
          <span class="value flex-grow-1 text-end">${counters.depression}</span>
        </li>
          <p class="detail small ms-4 my-0 text-justify${
            counters.weight_detail < 2 ? " d-none" : ""
          }">
            ${
              counters.weight_detail === 2
                ? "Patient has lost/gained weight but less than half a stone"
                : counters.weight_detail === 3
                ? "Patient has lost more than half a stone in weight"
                : "Patient has gained more than half a stone in weight"
            }
          </p>
        <li class="d-flex ${counters.depressive_ideas > 2 ? "mark" : ""}">
          <strong class="label">Depressive Ideas:</strong>
          <span class="value flex-grow-1 text-end">${
            counters.depressive_ideas
          }</span>
        </li>
        <li class="d-flex ${counters.phobia > 2 ? "mark" : ""}">
          <strong class="label">Phobias:</strong>
          <span class="value flex-grow-1 text-end">${counters.phobia}</span>
        </li>
        <li class="d-flex ${counters.worry > 2 ? "mark" : ""}">
          <strong class="label">Worry:</strong>
          <span class="value flex-grow-1 text-end">${counters.worry}</span>
        </li>
        <li class="d-flex ${counters.anxiety > 2 ? "mark" : ""}">
          <strong class="label">Anxiety:</strong>
          <span class="value flex-grow-1 text-end">${counters.anxiety}</span>
        </li>
        <li class="d-flex ${counters.panic > 2 ? "mark" : ""}">
          <strong class="label">Panic:</strong>
          <span class="value flex-grow-1 text-end">${counters.panic}</span>
        </li>
        <li class="d-flex ${counters.compulsions > 2 ? "mark" : ""}">
          <strong class="label">Compulsions:</strong>
          <span class="value flex-grow-1 text-end">${
            counters.compulsions
          }</span>
        </li>
        <li class="d-flex ${counters.obsessions > 2 ? "mark" : ""}">
          <strong class="label">Obsessions:</strong>
          <span class="value flex-grow-1 text-end">${counters.obsessions}</span>
        </li>
        <li class="d-flex ${imp ? "mark" : ""}">
          <strong class="label">Social Impairment:</strong>
          <span class="value flex-grow-1 text-end">${impairment[imp]}</span>
        </li>
      </ul>
      `,
  key_data: {
    time: now.toUTCString(),
    primary_diagnosis_code: outputs.DIAG1,
    primary_diagnosis_text: diagnoses[outputs.DIAG1],
    secondary_diagnosis_code: outputs.DIAG2,
    secondary_diagnosis_text: diagnoses[outputs.DIAG2],
    total_score: counters.score,
  },
  items: items
    .filter((i) => i.answer)
    .map((i) => {
      return { id: i.id, question: i.question, answer: i.answer };
    }),
  datetime: now.toUTCString(),
};
</script>

<template>
  <main class="container-sm">
    <ResultSheet :content="content" />
  </main>
</template>
