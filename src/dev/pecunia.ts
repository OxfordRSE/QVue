import {
  Answer,
  type AnswerRow,
  AnswerType,
  type AnswerValidator,
  Item,
  Questionnaire,
  type QuestionnaireProperties,
  Validator,
  Validators,
  ValidatorsWithProps,
} from "questionnaire-core";

export * from "questionnaire-core";

const currency_symbol = "&pound;";

const required_if: (
  expr: (answer: Answer, item: Item, state: Questionnaire) => boolean
) => AnswerValidator = (expr) =>
  Validator((ans, item, state) => {
    console.log(`${ans.id}: required_if`);
    if (
      expr(ans, item, state) &&
      (typeof ans.content === "undefined" || ans.content === "")
    )
      return `More information is required`;
    return null;
  });

const new_medication_item: (id: string) => Item = (id) => {
  return new Item({
    id: id,
    question: `
<p class="fw-bold">Please describe any prescribed medications you have taken 
in the past 3 months.</p>
${
  id !== "C1.2.8"
    ? `<p class="fst-italic">If you enter an answer for this question, you will be asked again so you can describe another medication.</p>`
    : ``
}
<p class="fst-italic">If you have taken the same medication at different doses, 
please list each dose in a separate answer and indicate the duration for each 
dose if known.</p>`,
    answers: [
      {
        type: AnswerType.TEXT,
        label: "Medication name",
      },
      {
        type: AnswerType.SELECT,
        label: "Medication type",
        validators: [required_if((ans, item) => item.answers[0].content)],
        options: [
          { label: "tablet/capsule" },
          { label: "cream" },
          { label: "liquid" },
          { label: "injection" },
          {
            label: "other",
            extra_answers: [
              {
                type: AnswerType.TEXT,
                placeholder: "please specify",
                validators: [
                  required_if((ans, item) => item.answers[1].content === 4),
                ],
              },
            ],
          },
        ],
      },
      {
        type: AnswerType.NONE,
        label: "Dose",
        extra_answers: [
          {
            id: `${id}_dose`,
            type: AnswerType.NUMBER,
            validators: [required_if((ans, item) => item.answers[0].content)],
          },
          {
            type: AnswerType.SELECT,
            validators: [required_if((ans, item) => item.answers[0].content)],
            options: [
              { label: "mg" },
              { label: "g" },
              { label: "ml" },
              {
                label: "other",
                extra_answers: [
                  {
                    type: AnswerType.TEXT,
                    placeholder: "please specify",
                    validators: [
                      required_if(
                        (ans, item) =>
                          item.answers[2].extra_answers[1].content === 3
                      ),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: AnswerType.NONE,
        label: "How often have you taken the given medication?",
        extra_answers: [
          {
            id: `${id}_frequency`,
            type: AnswerType.NUMBER,
            min: 1,
            validators: [
              Validator((ans, item) => {
                if (!item.answers[0].content) return null;
                if (typeof ans.content === "undefined")
                  return `An answer is required`
                if (ans.content < 1) return `Answer must be 1 or larger`
                return null
              })
            ],
            label_right: "times",
          },
          {
            type: AnswerType.SELECT,
            validators: [required_if((ans, item) => item.answers[0].content)],
            options: [
              { label: "per day" },
              { label: "per week" },
              { label: "per month" },
              { label: "as needed" },
              {
                label: "other",
                extra_answers: [
                  {
                    id: `${id}_frequency_other`,
                    type: AnswerType.TEXT,
                    placeholder: "please specify",
                    validators: [
                      required_if(
                        (ans, item) =>
                          item.answers[3].extra_answers[1].content === 4
                      ),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: AnswerType.NONE,
        label:
          "For how long have you taken the given medication in the past 3 months?",
        extra_answers: [
          {
            id: `${id}_duration`,
            type: AnswerType.NUMBER,
            validators: [required_if((ans, item) => item.answers[0].content)],
          },
          {
            type: AnswerType.SELECT,
            validators: [required_if((ans, item) => item.answers[0].content)],
            options: [
              { label: "day(s)" },
              { label: "week(s)" },
              { label: "month(s)" },
            ],
          },
        ],
      },
    ],
    next_item_fun: (last_changed_answer, current_item, state) => {
      if (typeof current_item.answers[0].content === "undefined") return "D1";
      return state.next_item_in_sequence_id;
    },
  });
};

const medication_items: Item[] = [];
for (let i = 0; i < 8; i++)
  medication_items.push(new_medication_item(`C1.2.${i + 1}`));

export const _state_properties: QuestionnaireProperties = {
  name: "PECUNIA RUM",
  introduction: `
  <p>The ProgrammE in Costing, resource use measurement and outcome valuation 
  for Use in multi-sectoral National and International health economic 
  evaluAtions (PECUNIA) Resource Use Measurement (RUM) questionnaire
  asks about various impacts of your health.
  </p> 
  `,
  citation: `[PECUNIA Group (2021): PECUNIA Resource Use Measurement Instrument (PECUNIA RUM) (Version 1.0/2021).](https://www.pecunia-project.eu/tools/rum-instrument)  
  [DOI 10.5281/zenodo.5036941](https://doi.org/10.5281/zenodo.5036941)`,
  items: [
    new Item({
      id: "welcome",
      question: `
       <p class="fs-6">
       In this questionnaire we are trying to find out about the various 
       impacts of your health. Please read the instructions provided for 
       each question carefully. 
       </p>
       <p class="fs-6">
       Questions that can be skipped are clearly indicated. 
       </p>
       <p class="fs-6">
       If you have difficulty answering any of the questions or knowing 
       details, please provide the best answer you can. 
       </p>
       <p class="fs-6">
       Thank you very much in advance for helping us by completing this questionnaire.
       </p>
       <p class="fs-6">This questionnaire consists of the following sections:</p>
       <dl class="fs-6">
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section A</dt> <dd>Place of living and overnight stays</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section B</dt> <dd>Non-residential health and social care</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section C</dt> <dd>Medication</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section D</dt> <dd>Unpaid help (informal care)</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section E</dt> <dd>Education</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section F</dt> <dd>Employment and productivity</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section G</dt> <dd>Safety and justice system</dd>
        </div> 
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section H</dt> <dd>Out-of-pocket and other expenses</dd>
        </div>
        <div class="d-flex flex-wrap">
          <dt class="pe-2">Section I</dt> <dd>Final remarks</dd>
        </div>
       </dd>`,
    }),
    {
      id: "A_intro",
      question: `
      <h4>Section A. Place of living and overnight stays</h4>
      <p class="fs-6">In this section, we ask you about your <strong>usual place of 
      living</strong> and any overnight stays you have had in the 
      <strong>past 3 months</strong> 
      (i.e. in the <strong>past 90 nights</strong>).</p>`,
    },
    new Item({
      id: "A1",
      question: `
      <p class="fw-bold">Where have you lived or stayed overnight 
      (e.g. in hospital) in the past 3 months?</p>
      <p class="fst-italic">Please indicate the number of nights that you 
      spent in each place. 
      If you are unsure, please use ‘Other’ and provide details.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Individual or shared flat or house",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Family or friend’s flat or house ",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Dormitory (e.g. boarding school, university residence)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Paid temporary accommodation (e.g. hotel)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Emergency shelter (e.g. temporary shelter for homeless)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Sheltered housing (e.g. housing with assistance)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Nursing home (e.g. residential care home with nursing)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other long-term residential care home",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label:
            "Therapeutic community home (e.g. temporary group residence for therapeutic purposes)",
          label_right: "nights",
        },
        {
          type: AnswerType.NONE,
          label: `
          <p>Hospital</p>
          <p>Please enter the type of hospital department/service 
          (e.g. oncology, surgery, psychiatry) and how many nights 
          you stayed there.</p>`,
        },
        {
          id: "A1_hospital_0",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "nights",
          extra_answers: [
            {
              id: "A1_hospital_0_detail",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[10].content > 0),
              ],
            },
          ],
        },
        {
          id: "A1_hospital_1",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "nights",
          extra_answers: [
            {
              id: "A1_hospital_1_detail",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[11].content > 0),
              ],
            },
          ],
        },
        {
          id: "A1_hospital_2",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "nights",
          extra_answers: [
            {
              id: "A1_hospital_2_detail",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[12].content > 0),
              ],
            },
          ],
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Palliative care (e.g. hospice)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Place of detention (e.g. prison)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "On the street",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "nights",
          extra_answers: [
            {
              id: "A1_other_detail",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[16].content > 0),
              ],
            },
          ],
        },
      ],
    }),
    {
      id: "B_intro",
      question: `
      <h4>Section B. Non-residential health and social care</h4>
      <p class="fs-6">In this section, we ask you about any <strong>non-residential health 
      and social care services</strong> you have used in the <strong>past 3 
      months</strong> to help you with an illness or other life problems 
      (e.g. being a victim of crime, care needs). 
      These services include non-emergency contacts (e.g. primary care), 
      day care (e.g. admission to a hospital as a day patient), 
      contacts with support/self-help groups, 
      emergency contacts (e.g. emergency ambulance rides), 
      contacts with helplines, and vocational services 
      (e.g. sheltered workshops).
      </p>`,
    },
    {
      id: "B1",
      question: `
      <p class="fw-bold">Have you used any non-emergency outpatient/social 
      care services in the past 3 months?</p>
      <p class="fst-italic">Non-emergency outpatient/social care services could 
      include routine check-up appointments, scheduled appointments to discuss 
      any physical or mental health issues, 
      and telephone or online contacts 
      (e.g. phone consultation, online prescription ordering). 
      Please only consider the services you used for yourself and not those you 
      may have used on behalf of someone else.
      </p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B1.2";
        return "B2.1";
      },
    },
    {
      id: "B1.2",
      question: `
      <p class="fw-bold">How many times have you used any of the following 
      non-emergency outpatient/social care services in the past 3 months?</p>
      <p class="fst-italic">Please indicate the number of times you have used 
      a given service for all answers that apply. 
      If you are unsure, please use ‘Other’ and provide details.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "General practitioner (GP)/family doctor",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Dental care",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          label:
            "Specialist medical care (e.g. orthopaedist, psychiatrist, gynaecologist)",
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_specialist_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
        {
          label: "Diagnostic imaging services (e.g. MRI, CT scan)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_imaging_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[3].content > 0),
              ],
            },
          ],
        },
        {
          label:
            "Diagnostic laboratory services (e.g. genetic testing, blood tests)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_lab_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[4].content > 0),
              ],
            },
          ],
        },
        {
          label:
            "Other health care (e.g. psychologist, physiotherapist, dietician)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_other-healthcare_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[5].content > 0),
              ],
            },
          ],
        },
        {
          label: "Social care (e.g. social worker)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_social_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[6].content > 0),
              ],
            },
          ],
        },
        {
          label:
            "Holistic health care (e.g. acupuncturist, homeopathist, Traditional Chinese Medicine (TCM), osteopath)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_alternative_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[7].content > 0),
              ],
            },
          ],
        },
        {
          label: "Other",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "times",
          extra_answers: [
            {
              id: "B1.2_other_text",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[8].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "B2.1",
      question: `
<p class="fw-bold">Have you used any day care services in the past 3 months?</p>
<p class="fst-italic">Day care services are usually used only for part of the 
day and do not involve an overnight stay.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B2.2";
        return "B3.1";
      },
    },
    {
      id: "B2.2",
      question: `
<p class="fw-bold">How many times did you use any of the following day care 
services in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of times you have used 
      a given service for all answers that apply. 
      If you are unsure, please use ‘Other’ and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Medical day care (e.g. day patient in hospital)",
          label_right: "days",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Non-medical day care (e.g. day care centre)",
          label_right: "days",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "days",
          extra_answers: [
            {
              id: "B2.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "B3.1",
      question: `
<p class="fw-bold">Have you participated in any support/self-help groups in 
the past 3 months?</p>
<p class="fst-italic">A support/self-help group is a group of people that meet 
to discuss their condition and provide each other with emotional support 
or advice.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes, I participated in a support/self-help group",
              extra_answers: [
                {
                  id: "B3.1_number",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content <= 0)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "times",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
    },
    {
      id: "B4.1",
      question: `
<p class="fw-bold">Have you used any emergency care services for yourself in 
the past 3 months?</p>
<p class="fst-italic">
Emergency care services include: a ride in an emergency ambulance, 
a visit to an Accident and Emergency (A&E) department, 
a visit from paramedics, or contact with an emergency doctor on call.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B4.2";
        return "B5.1";
      },
    },
    {
      id: "B4.2",
      question: `
<p class="fw-bold">How many times have you used any of the following emergency 
care services for yourself in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of contacts you had with a 
given service for all answers that apply. 
If you are unsure, please use ‘Other’ and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NONE,
          label: "Emergency ambulance (e.g. paramedics)",
        },
        {
          id: "B4.2_ambulance_face",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Face-to-face",
          label_right: "contacts",
        },
        {
          id: "B4.2_ambulance_remote",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Online/telephone",
          label_right: "contacts",
        },
        {
          type: AnswerType.NONE,
          label: "Out-of-hours medical service (e.g. night care)",
        },
        {
          id: "B4.2_out-of-hours_face",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Face-to-face",
          label_right: "contacts",
        },
        {
          id: "B4.2_out-of-hours_remote",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Online/telephone",
          label_right: "contacts",
        },
        {
          type: AnswerType.NONE,
          label: "Accident and Emergency (A&E) department",
        },
        {
          id: "B4.2_a-and-e_face",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Face-to-face",
          label_right: "contacts",
        },
        {
          id: "B4.2_a-and-e_remote",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Online/telephone",
          label_right: "contacts",
        },
        {
          type: AnswerType.NONE,
          label: "Fire brigade",
        },
        {
          id: "B4.2_fire_face",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Face-to-face",
          label_right: "contacts",
        },
        {
          id: "B4.2_fire_remote",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Online/telephone",
          label_right: "contacts",
        },
        {
          type: AnswerType.NONE,
          label: "Other rescue services (e.g. mountain rescue)",
        },
        {
          id: "B4.2_other_type",
          type: AnswerType.TEXT,
          placeholder: "please specify",
          validators: [
            required_if((ans, item) => {
              console.log(`Validate ${ans.id}`);
              return (
                item.answers[14].content > 0 || item.answers[15].content > 0
              );
            }),
          ],
        },
        {
          id: "B4.2_other_face",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Face-to-face",
          label_right: "contacts",
        },
        {
          id: "B4.2_other_remote",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Online/telephone",
          label_right: "contacts",
        },
      ],
    },
    {
      id: "B5.1",
      question: `
<p class="fw-bold">Have you contacted a helpline (phone/online) regarding 
health or other life problems in the past 3 months?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B5.2";
        return "B6.1";
      },
    },
    {
      id: "B5.2",
      question: `
<p class="fw-bold">How many times have you contacted a helpline (phone/online) 
regarding health or other life problems in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of contacts you had with a 
given service for all answers that apply. 
If you are unsure, please select ‘Other’ and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "For information (e.g. pharmacy, health hotline)",
          label_right: "contacts",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "For support (e.g. mental health support hotline)",
          label_right: "contacts",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "contacts",
          extra_answers: [
            {
              id: "B5.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "B6.1",
      question: `
<p class="fw-bold">Have you used any vocational services in the past 3 
months?</p>
<p class="fst-italic">Vocational services are services that help people get 
back into work. These might include job-specific training or support for 
people with disabilities to develop work-related skills
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B6.2";
        return "B7.1";
      },
    },
    {
      id: "B6.2",
      question: `
<p class="fw-bold">How many times have you used any of the following 
vocational services in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of days you used a given 
service for all answers that apply. 
If you are unsure, please use ‘Other’ and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          <p>Vocational training</p>
          <p class="small">(training for a specific type of job that provides 
          the trainee with a qualification (e.g. a diploma) that allows them 
          to work in a specific profession, e.g. as an electrical 
          technician)</p>`,
          label_right: "days",
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          <p>Sheltered workshop</p>
          <p class="small">(place of work specially designed to provide a safe 
          environment for people with (mental) disability, unpaid or very 
          low paid)</p>`,
          label_right: "days",
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          <p>Integration workplace</p>
          <p class="small">(place of work promoting the integration and 
          inclusion of people with (mental) disability into a work 
          environment, low paid)</p>`,
          label_right: "days",
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          <p>Supported employment programmes</p>
          <p class="small">(supporting people with some (mental) disability to 
          secure and retain paid employment, normally paid)</p>`,
          label_right: "days",
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "days",
          extra_answers: [
            {
              id: "B6.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[4].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "B7.1",
      question: `
<p class="fw-bold">Have you received any non-emergency transport for your 
health and social care needs in the past 3 months?</p>
<p class="fst-italic">Please consider any special transport service you needed 
to reach your non-emergency inpatient our outpatient appointments. 
These transports could include for instance a ride in an ambulance, 
or a specially equipped taxi.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "B7.2";
        return "C_intro";
      },
    },
    {
      id: "B7.2",
      question: `
<p class="fw-bold">How many times have you received non-emergency transport 
for your health and social care needs in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of times you used a given 
service for all answers that apply. 
If you are unsure, please use ‘Other’ and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Non-emergency ambulance ride",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Taxi service",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "times",
          extra_answers: [
            {
              id: "B7.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "C_intro",
      question: `
      <h4>Section C. Medication</h4>
      <p class="fs-6">In this section, we ask you about any <strong>prescribed 
      medication</strong> you have taken to treat your illness in the 
      <strong>past 3 months</strong>. 
      This could include tablets, capsules, liquids or injections.
      </p>`,
    },
    {
      id: "C1.1",
      question: `
<p class="fw-bold">Have you used any prescribed medication in the past 3 months?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "C1.2.1";
        return "D_intro";
      },
    },
    ...medication_items,
    {
      id: "D_intro",
      question: `
      <h4>Section D. Unpaid help (informal care)</h4>
      <p class="fs-6">In this section, we ask you about any <strong>unpaid help</strong> 
      (informal care) you received from your partner, family, friends, 
      neighbours and/or volunteers in the <strong>past 3 months</strong>. 
      The giver of such care is not expected to be paid for providing this 
      help. When answering the questions, please consider the following help</p>
      <ul class="fs-6 small">
        <li>Food preparation</li>
        <li>Eating and drinking</li>
        <li>Mobility around the house</li>
        <li>Moving or travelling outside the house</li>
        <li>Walking</li>
        <li>Washing</li>
        <li>Bathing</li>
        <li>Dressing</li>
        <li>Hair care</li>
        <li>Shaving</li>
        <li>Toileting and grooming</li>
        <li>Housekeeping</li>
        <li>Medication</li>
        <li>Prevention of dangerous/risky behaviours 
        (to oneself and/or others)</li>
      </ul>`,
    },
    new Item({
      id: "D1",
      question: `
<p class="fw-bold">How many hours of unpaid help (informal care) have you 
received because of your health in the past 3 months?</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "hours per week",
        },
      ],
    }),
    {
      id: "E_intro",
      question: `
      <h4>Section E. Education</h4>
      <p class="fs-6">
      In this section, we ask you about your <strong>education</strong>, any 
      difficulties you have faced in completing your education 
      (e.g. missing school or repeating a year) and your use of any education 
      support services (e.g. tutoring or remedial teaching) in the 
      <strong>past 3 months</strong>.
</p>
      `,
    },
    new Item({
      id: "E1",
      question: `
<p class="fw-bold">What is the highest level of education you have completed?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Primary education or lower" },
            { label: "Lower secondary education" },
            { label: "Upper secondary education" },
            { label: "Post-secondary non-tertiary education" },
            { label: "Short-cycle tertiary education" },
            { label: "Bachelor’s degree or equivalent level (e.g. BSc, BA)" },
            {
              label: "Master’s degree or equivalent level (e.g. MSc, MA, Mag)",
            },
            { label: "Doctoral degree or equivalent level (e.g. Dr, PhD)" },
            {
              label: "Other",
              extra_answers: [
                {
                  id: "E1_other",
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if((ans, item) => item.answers[0].content === 8),
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    new Item({
      id: "E2",
      question: `
<p class="fw-bold">Have you been a student in the past 3 months?</p>
<p class="fst-italic">Being a student means that you are enrolled in an 
educational facility (either full-time or part-time) and receive education 
on a regular basis.</p>
<p class="fst-italic">Special education refers to the practice of educating 
students in a way that addresses their individual needs 
(e.g. learning/physical/developmental disabilities).
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes, in a special education day school" },
            { label: "Yes, in a day school" },
            { label: "Yes, in a special education boarding school" },
            { label: "Yes, in a boarding school" },
            {
              label:
                "Yes, in a higher education school (e.g. university, college, vocational school)",
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
            {
              label: "Other",
              extra_answers: [
                {
                  id: "E2_other",
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if((ans, item) => item.answers[0].content === 7),
                  ],
                },
              ],
            },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if ([5, 6].includes(last_changed_answer?.content)) return "E6";
        return "E3";
      },
    }),
    new Item({
      id: "E3",
      question: `
<p class="fw-bold">Have you had problems with completing your education because 
of your health in the past 3 months?</p>
<p class="fst-italic">Please tick every applicable box below.
</p>`,
      answers: [
        {
          type: AnswerType.CHECKBOX,
          options: [
            { label: "Yes, I had to stop my education" },
            { label: "Yes, I had a study delay (e.g. I had to repeat a year)" },
            { label: "Yes, I had to change to a lower education level" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
            {
              label: "Other",
              extra_answers: [
                {
                  id: "E3_other",
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if(
                      (ans, item) =>
                        item.answers[0].content &&
                        item.answers[0].content.includes(5)
                    ),
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    new Item({
      id: "E4",
      question: `
<p class="fw-bold">Have you missed any days of education because of your 
health in the past 3 months?</p>
<p class="fst-italic">Please only consider the days when you were not able to 
participate in classes.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes, I have missed school",
              extra_answers: [
                {
                  id: "E4_missed_count",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content < 1)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_left: "on",
                  label_right: "days",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
    }),
    new Item({
      id: "E5",
      question: `
<p class="fw-bold">Have there been days when you were bothered by physical or 
mental health problems at school in the past 3 months?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes",
              extra_answers: [
                {
                  id: "E5_missed_count",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content < 1)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_left: "on",
                  label_right: "days",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
    }),
    {
      id: "E6",
      question: `
<p class="fw-bold">Have you used education support services in the 
past 3 months?</p>
<p class="fst-italic">This includes any additional educational support you 
have received, such as tutoring, additional lessons, etc.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "E6.1";
        return "E7.1";
      },
    },
    {
      id: "E6.1",
      question: `
<p class="fw-bold">How much did you use other education support services in 
the past 3 months?
</p>
<p class="fst-italic">Please give the average number of hours per week
that you used the service for each service that applies.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Education support at your place of study",
          label_right: "hours per week",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label:
            "Education support in a private setting (e.g. private tutoring)",
          label_right: "hours per week",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "hours per week",
          extra_answers: [
            {
              id: "E6.1_other",
              type: AnswerType.TEXT,
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "E7.1",
      question: `
<p class="fw-bold">Have you received any special transport to attend education 
in the past 3 months?</p>
<p class="fst-italic">Please consider any special transport service you needed 
to reach your educational appointments. These transports could include for 
instance a ride in a specially equipped taxi.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "E7.2";
        return "F_intro";
      },
    },
    {
      id: "E7.2",
      question: `
<p class="fw-bold">How many times have you received special transport to 
attend education in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of times you used a given 
service for all answers that apply. If you are unsure, please use ‘Other’ 
and provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Specialized taxi service",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "times",
          extra_answers: [
            {
              id: "E7.2_other",
              type: AnswerType.TEXT,
              validators: [
                required_if((ans, item) => item.answers[1].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "F_intro",
      question: `
<h4>Section F. Employment and productivity</h4>
<p class="fs-6">In this section, we ask you about your <strong>paid and unpaid work</strong> 
(e.g. household tasks) and any difficulties you might have faced at work 
because of your health (e.g. missing work days or not being able to do as much 
work as you normally would). Please note that the questions in this section 
are about the <strong>past 3 months</strong>.
</p>`,
    },
    {
      id: "F1",
      question: `
<p class="fw-bold">What do you do?</p>
<p class="fst-italic">Choose the option that is closest to what you usually do.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "I go to school, I am studying" },
            { label: "I am employed (part-time or full-time)" },
            { label: "I am self-employed" },
            { label: "I volunteer" },
            { label: "I am a homemaker or stay-at-home parent" },
            { label: "I am unemployed" },
            {
              label: "I am unable to work because ",
              extra_answers: [
                {
                  id: "F1_unable_reason",
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if((ans, item) => item.answers[0].content === 6),
                  ],
                },
              ],
            },
            { label: "I am retired or on a pre-pension plan" },
            {
              label: "Other",
              extra_answers: [
                {
                  id: "F1_other",
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if((ans, item) => item.answers[0].content === 8),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "F2",
      question: `
<p class="fw-bold">Do you have a paying job?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [{ label: "Yes" }, { label: "No" }],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "F3";
        return "F9_intro";
      },
    },
    {
      id: "F3",
      question: `
<p class="fw-bold">What is your occupation?</p>
<p class="fst-italic">Please indicate the occupation for which you get paid.
</p>`,
      answers: [{ type: AnswerType.TEXT }],
    },
    {
      id: "F4",
      question: `
<p>How many <strong>hours</strong> a week do you work?</p>
<p class="fst-italic">Please indicate the number of hours below.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          validators: [ValidatorsWithProps.GTE(1)],
          label_right: "hours",
        },
      ],
    },
    {
      id: "F5",
      question: `
<p>How many <strong>days</strong> a week do you work?</p>
<p class="fst-italic">Please indicate the number of days below.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_right: "days",
        },
      ],
    },
    {
      id: "F6",
      question: `
<p class="fw-bold">Have you missed any work because of your health in the 
past 3 months?</p>
<p class="fst-italic">This can be due to minor or severe physical or 
mental health problems.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes, I have missed work days in the past 3 months",
              extra_answers: [
                {
                  id: "F6_missed_days",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content < 1)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "days",
                },
              ],
            },
            { label: "No" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "F7";
        return "F8";
      },
    },
    {
      id: "F7",
      question: `
<p class="fw-bold">Did you miss any work because of your health prior to the 
past 3 months?</p>
<p class="fst-italic">This can be due to minor or severe physical or mental 
health problems.</p>
<p class="fst-italic">This refers to one whole uninterrupted period of missed 
work as a result of being sick.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [{ label: "Yes" }, { label: "No" }],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "F7.1";
        return "F8";
      },
    },
    {
      id: "F7.1",
      question: `
<p class="fw-bold">When did you call in sick?</p>
<p class="fst-italic">Please fill in the date below.</p>`,
      answers: [{ type: AnswerType.DATE }],
      next_item: "F9_intro",
    },
    {
      id: "F8",
      question: `
<p class="fw-bold">Were there days on which you worked but were bothered by 
physical or mental health problems during the past 3 months?
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [{ label: "Yes" }, { label: "No" }],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "F8.1";
        return "F9_intro";
      },
    },
    {
      id: "F8.1",
      question: `
<p class="fw-bold">How many days at work were you bothered by physical or 
mental health problems? Only count the days at work in the past 3 months.</p>
<p class="fst-italic">Please indicate the number of days below.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(1)],
          label_right: "working days",
        },
      ],
    },
    {
      id: "F8.2",
      question: `
<p class="fw-bold">On the days that you were bothered by these problems, 
was it difficult to get as much work done as you normally do? 
On these days, how much work could you do on average?</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { content: 0, label: "0 - On these days I could not do anything" },
            { content: 1 },
            { content: 2 },
            { content: 3 },
            { content: 4 },
            {
              content: 5,
              label: "5 - I was able to do half as much as I normally do",
            },
            { content: 6 },
            { content: 7 },
            { content: 8 },
            { content: 9 },
            {
              content: 10,
              label: "10 - I was able to do just as much as I normally do",
            },
          ],
        },
      ],
    },
    {
      id: "F9_intro",
      question: `
<p>Even for unpaid work, you can be bothered by your health. Sometimes as a 
result you might do less. For example, you have trouble doing household tasks, 
caring for your children, doing voluntary work, or you are unable to run 
errands, pick up groceries or work in the garden. The following questions 
refer to this.</p>`,
    },
    {
      id: "F9",
      question: `
<p class="fw-bold">Were there days on which you did less unpaid work because 
of your health?</p>
<p class="fst-italic">Only consider the past 3 months.
</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [{ label: "Yes" }, { label: "No" }],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "F9.1";
        return "G_intro";
      },
    },
    {
      id: "F9.1",
      question: `
<p class="fw-bold">How many days did this happen?</p>
<p class="fst-italic">Only count the days in the past 3 months.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(1)],
          label_right: "days",
        },
      ],
    },
    {
      id: "F9.2",
      question: `
<p class="fw-bold">Imagine that somebody, e.g. your partner, family member or 
a friend helped you on those days, and he or she did all the unpaid work that 
you were unable to do for you. How many hours on average would that person 
spend doing this on those days?</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(1)],
          label_right: "hours per day",
        },
      ],
    },
    {
      id: "G_intro",
      question: `
<h4>Section G. Safety and justice system</h4>
<p class="fs-6">In this section, we ask you about your contacts with professionals working 
in the safety and justice sector (e.g. police, lawyers) in the 
<strong>past 3 months</strong>. It can be that, because of your health, 
you have been in contact with one of these persons. As this can sometimes be 
associated with high costs, we would like to know more about these contacts.</p>`,
    },
    {
      id: "G1",
      question: `
<p class="fw-bold">Have you had any contact with the police in the past 
3 months?</p>
<p class="fst-italic">Please only consider a face-to-face contact either at a 
police station or somewhere. Emergency phone calls (e.g. 112 or 999) are 
excluded.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes",
              extra_answers: [
                {
                  id: "G1_number",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content < 1)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "times",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
    },
    {
      id: "G2",
      question: `
<p class="fw-bold">Have you used legal services (e.g. contact with a lawyer) 
in the past 3 months?</p>
<p class="fst-italic">This could be a face-to-face meeting, an online 
consultation or a phone call with someone working in legal services.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            {
              label: "Yes",
              extra_answers: [
                {
                  id: "G2_number",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (item.answer.content === 0 && ans.content < 1)
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "times",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
    },
    {
      id: "G3",
      question: `
<p class="fw-bold">Have you been to court in the past 3 months?</p>
<p class="fst-italic">Please note that this could be in any role 
(e.g. victim, witness or defendant).</p>`,
      answers: [
        {
          type: AnswerType.CHECKBOX,
          options: [
            {
              label: "Yes, for civil law (e.g. for a divorce)",
              extra_answers: [
                {
                  id: "G3_civil_number",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (
                        item.answer.content &&
                        item.answer.content.includes(0) &&
                        ans.content < 1
                      )
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "times",
                },
              ],
            },
            {
              label: "Yes, for criminal law",
              extra_answers: [
                {
                  id: "G3_criminal_number",
                  type: AnswerType.NUMBER,
                  min: 0,
                  default_content: 0,
                  validators: [
                    Validator((ans, item) => {
                      if (
                        item.answer.content &&
                        item.answer.content.includes(0) &&
                        ans.content < 1
                      )
                        return `Answer must be 1 or larger`;
                      return null;
                    }),
                  ],
                  label_right: "times",
                },
              ],
            },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
          validators: [
            Validator((ans) => {
              if (!(ans.content instanceof Array) || !ans.content.length)
                return `An answer is required`;
              if (ans.content.includes(2) && ans.content.length !== 1)
                return `You cannot check 'No' and another answer`;
              if (ans.content.includes(3) && ans.content.length !== 1)
                return `You cannot check 'unsure' and another answer`;
              return null;
            }),
          ],
        },
      ],
    },
    {
      id: "G4",
      question: `
<p class="fw-bold">Have you been confined anywhere involuntarily 
(e.g. in a prison, police station or secure psychiatric hospital) in the 
past 3 months?</p>
<p class="fst-italic">This means that you were not free to leave.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "G4.1";
        return "G5_intro";
      },
    },
    {
      id: "G4.1",
      question: `
<p class="fw-bold">How many nights were you confined involuntarily in the past 
3 months?</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Police station/place of detention (e.g. prison)",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Secure hospital/secure psychiatric institution",
          label_right: "nights",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "nights",
          extra_answers: [
            {
              type: AnswerType.TEXT,
              id: "G4.1_other",
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "G4.2",
      question: `
<p class="fw-bold">How many hours did you spend in confinement on days where 
you were only confined for part of the day 
(i.e. did not spend the night there)?</p>
<p class="fst-italic">Please note that we are only asking about times when you 
were confined and then released on the same day.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Police station/place of detention (e.g. prison)",
          label_right: "hours",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "hours",
          extra_answers: [
            {
              type: AnswerType.TEXT,
              id: "G4.1_other",
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[1].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "G5_intro",
      question: `
<p>In the next section, we ask you about any crimes that have affected you as 
a victim and/or any crimes that you have committed. As this can sometimes be 
associated with high costs, we would like to know more about this.</p>`,
    },
    {
      id: "G5.1",
      question: `
<p class="fw-bold">Have you been a victim of, or involved in, theft in the 
past 3 months?</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "G5.2";
        return "G5.3";
      },
    },
    {
      id: "G5.2",
      question: `
<p class="fw-bold">How often did the following happen in the past 3 months?</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label: "Stealing without violence (e.g. theft, pickpocketing)",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.2_nonviolent_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label: "Stealing with violence (e.g. robbery)",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.2_violent_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
      ],
    },
    {
      id: "G5.3",
      question: `
<p class="fw-bold">Have you been affected by property damage (vandalism) 
in the past 3 months?</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "G5.4";
        return "G6.1";
      },
    },
    {
      id: "G5.4",
      question: `
<p class="fw-bold">How often have you been affected by the following acts of 
property damage in the past 3 months?</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label:
            "Damage to a car (e.g. it was scraped with a key or the windows were smashed)",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.4_car_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label: "Minor damage to a home (e.g. graffiti)",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.4_minor_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label: "Major damage to a home (e.g. it was burned down)",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.4_major_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          label: "Other",
          options: [
            { label: "Victim" },
            { label: "Perpetrator" },
            { label: "Both" },
            { label: "I would rather not say" },
          ],
          extra_answers: [
            {
              id: "G5.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if(
                  (ans, item) => item.answers[3].extra_answers[1].content > 0
                ),
              ],
            },
            {
              id: "G5.2_other_times",
              label_right: "times",
              type: AnswerType.NUMBER,
              min: 0,
              default_content: 0,
              validators: [ValidatorsWithProps.GTE(0)],
            },
          ],
        },
      ],
    },
    {
      id: "G6.1",
      question: `
<p class="fw-bold">Have you received any special transport for your legal 
appointments (e.g. court session) in the past 3 months?</p>
<p class="fst-italic">Please consider any special transport service you needed 
to reach your legal appointments (e.g. court sessions). These transports could 
include for instance a ride in a specially equipped taxi.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { label: "Yes" },
            { label: "No" },
            { label: "I don’t know/I would rather not say" },
          ],
        },
      ],
      next_item_fun: (last_changed_answer) => {
        if (last_changed_answer?.content === 0) return "G6.2";
        return "H_intro";
      },
    },
    {
      id: "G6.2",
      question: `
<p class="fw-bold">How many times have you received special transport reach 
your legal appointments (e.g. court sessions) in the past 3 months?</p>
<p class="fst-italic">Please indicate the number of times you used a given 
service for all answers that apply. If you are unsure, please use ‘Other’ and 
provide details.
</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Ride in a police car",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Inmate transport",
          label_right: "times",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Other",
          label_right: "times",
          extra_answers: [
            {
              id: "G6.2_other",
              type: AnswerType.TEXT,
              placeholder: "please specify",
              validators: [
                required_if((ans, item) => item.answers[2].content > 0),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "H_intro",
      question: `
<h4>Section H. Out-of-pocket and other expenses</h4>
<p class="fs-6">In this section, we ask you about expenses you and your family have 
incurred because of your health in the past 3 months. These could include 
paying for private health insurance, health and social care out-of-pocket 
payments, paying for help with something you were not able to do on your own, 
such as cleaning or personal care, buying something (e.g. a wheelchair or 
walking frame), or modifying your home to help with mobility.</p>`,
    },
    {
      id: "H1.1",
      question: `
<p class="fw-bold">How was your health and social care paid for in the 
past 3 months?</p>
<p class="fst-italic">Please tick all answers that apply. 
If you are unsure, please tick ‘Other’ and provide details.</p>`,
      answers: [
        {
          type: AnswerType.CHECKBOX,
          options: [
            { label: "Public or national health service (e.g. NHS)" },
            { label: "Public or social health insurance" },
            { label: "Private health insurance" },
            { label: "I paid for these services myself out-of-pocket" },
            {
              label: "Other",
              extra_answers: [
                {
                  type: AnswerType.TEXT,
                  placeholder: "please specify",
                  validators: [
                    required_if((ans, item) => item.answer.content === 4),
                  ],
                },
              ],
            },
            { label: "I don’t know/I would rather not say" },
          ],
          validators: [
            Validator((ans) => {
              if (!(ans.content instanceof Array) || !ans.content.length)
                return `Please select at least one option`;
              if (ans.content.includes(5) && ans.content.length !== 1)
                return `You cannot answer 'unsure' with other options`;
              return null;
            }),
          ],
        },
      ],
    },
    {
      id: "H1.2",
      question: `
<p class="fw-bold">How much have you (and/or your family on your behalf) 
spent on using the services listed before in the past 3 months?</p>
<p class="fst-italic">Please estimate your total expenses over the past 3 
months.</p>
<p class="fst-italic">Please only consider private expenses that were paid for 
using your own funds and where you have not been and will not be reimbursed.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Private health insurance",
          label_left: currency_symbol,
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Residential health and social care services",
          label_left: currency_symbol,
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Non-residential health and social care services",
          label_left: currency_symbol,
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Prescription medication",
          label_left: currency_symbol,
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Education services",
          label_left: currency_symbol,
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: "Safety and justice system",
          label_left: currency_symbol,
        },
      ],
    },
    {
      id: "H1.3",
      question: `
<p class="fw-bold">In addition to the expenses for the goods and services 
already mentioned, what other expenses have you or your family incurred 
because of your health in the past 3 months?</p>
<p class="fst-italic">Please estimate your total expenses over the past 
3 months.</p>
<p class="fst-italic">Please only consider private expenses that were paid for 
using your own funds and where you have not been and will not be reimbursed.</p>`,
      answers: [
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label:
            "Cleaning or housekeeping assistance required because of your illness",
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label:
            "Paid childcare while you are attending appointments or temporarily away due to your health",
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          Complementary approaches to healthcare, such as
          <ul>
          <li>(Online) self-help</li>
          <li>Diet and nutrition</li>
          <li>Expressive therapies (dance, drama, music or poetry therapy)</li>
          <li>Stress reduction and relaxation techniques (gym, yoga, mindfulness meditation)</li>
          </ul>`,
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          Other (holistic) healing activities from someone other than a qualified healthcare professional, such as
          <ul>
          <li>Ayurveda treatment</li>
          <li>Ceremonies</li>
          <li>Chanting</li>
          <li>Faith healing</li>
          </ul>`,
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          Durable goods such as
          <ul>
          <li>Wheelchairs, rollators or walkers</li>
          <li>Bathroom accessories (e.g. non-slip mat, bathing chairs, shower handrails, safety bars)</li>
          <li>Nightlights</li>
          <li>Emergency alarms</li>
          <li>Adjustable beds</li>
          <li>Special telephones</li>
          </ul>`,
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label: `
          Non-durable goods (intended to be used for a short period of time), such as
          <ul>
          <li>(Disposable) swabs</li>
          <li>Dressing material</li>
          </ul>`,
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
      ],
    },
    new Item({
      id: "H1.4",
      question: `
<p class="fw-bold">In addition to the expenses for the goods and services 
already mentioned in this questionnaire, what other expenses have you or your 
family incurred because of your health in the past 3 months?</p>
<p class="fst-italic">Please estimate your total expenses over the past 
three months.</p>
<p class="fst-italic">Please only consider private expenses that were paid for 
using your own funds and where you have not been and will not be reimbursed.</p>`,
      answers: [
        {
          label: "Refurbishment of your home because of your health",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label:
            "Change of your residence/living arrangements or change to your type of accommodation (such as moving from an independent house in the community to an institutional care setting) because of your health. Please consider all relevant costs",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label:
            "Cancelling or postponing your holiday because of your health. Please consider all relevant costs",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label:
            "Informal carer’s hotel costs when they accompany you when you travel, or the cost of respite care when those normally assisting you are away or otherwise unavailable",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label: "Over-the-counter medication",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label: "Therapeutic pets (e.g. guide dog)",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label:
            "Transport expenses\n" +
            "Please consider only transport that concerns activities not listed before in the questionnaire\n",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
        },
        {
          label: "Other",
          type: AnswerType.NUMBER,
          min: 0,
          default_content: 0,
          validators: [ValidatorsWithProps.GTE(0)],
          label_left: currency_symbol,
          class_wrapper: "flex-wrap",
          extra_answers: {
            id: "other-expenses-description",
            type: AnswerType.TEXT,
            placeholder: "please specify",
            validators: [
              required_if((ans, item) => item.answers[7].content > 0),
            ],
          },
        },
      ],
    }),
    {
      id: "I1",
      question: `
<h4>Section I. Final remarks</h4>
<p class="fs-6">You have reached the final section of the questionnaire. 
Please tell us how easy it has been for you to complete.</p>`,
      answers: [
        {
          type: AnswerType.RADIO,
          validators: [Validators.REQUIRED],
          options: [
            { content: 1, label: "1 - Very easy" },
            { content: 2 },
            { content: 3 },
            { content: 4 },
            { content: 5 },
            { content: 6 },
            { content: 7 },
            { content: 8 },
            { content: 9 },
            { content: 10, label: "10 - Very difficult" },
          ],
        },
      ],
    },
    {
      id: "I2",
      question: `
<p class="fw-bold">If you have any comments regarding completing this 
questionnaire, please share them with us below.</p>`,
      answers: [{ type: AnswerType.TEXTAREA }],
    },
  ],
  onComplete: (state) => {
    const now = new Date();
    const items: AnswerRow[] = [];
    state.items
      .filter((i) => i.answers.length)
      .filter((i) => i.answers.filter((a) => a.content_changed).length)
      .forEach((i) => items.push(...i.as_rows));
    state.data = {
      summary: `
      <h1>PECUNIA summary</h1>
      ${items
        .map(
          (i) =>
            `
<dl>
  <dt>id</dt><dd>[${i.id}]</dd>
  <dt>data_id</dt><dd>${i.data_id}</dd>
  <dt>content</dt><dd>${i.content}</dd>
  <dt>label</dt><dd>${i.label}</dd>
  <dt>answer_utc_time</dt><dd>${i.answer_utc_time}</dd>
</dl>`
        )
        .join("\n")}`,
      key_data: {
        time: now.toUTCString(),
      },
      items,
      datetime: now.toUTCString(),
    };
  },
};

export const questionnaire: () => Questionnaire = () =>
  new Questionnaire(_state_properties);
