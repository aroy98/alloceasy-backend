const axios = require("axios");
const OpenAI = require("openai");
const mammoth = require("mammoth");

module.exports = {
  openai: () => {
    return new OpenAI({
      apiKey: "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",
    });
  },

  openai_employee_prompt: (content) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await module.exports.openai().chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `you are a data scientist. you can analysis any data and able to return json object as a output.
              to calculate role_based_on select items from this:[
                "Frontend",
                "Backend",
                "FullStack",
                "Quality assurance",
                "Team Lead",
                "Scrum Master",
              ]. 
              Follow this structure to generate the json object:
              {
                "name": "",
                "summary_based_on_project_experience_max_150_characters": "",
                "skills_max_5_based_on_project_expertise_demand_uniqueness": [
                  {
                    "skill_name": "",
                    "skill_rating": 0.0
                  }
                ],
                "work_experience_in_years_and_month": 0.0,
                "domain_specialization_min_3_max_5": [],
                "rating_based_on_skills_project_experience_max_100": 0,
                "role_based_on": []
              }
              `,
            },
            {
              role: "user",
              content: `do a resume parsing on this:${content} and return a JSON object`,
            },
          ],
          temperature: 0.1,
          max_tokens: 600,
        });
        resolve(response);
      } catch (error) {
        console.log({ error });
        reject(error);
      }
    });
  },

  openai_project_prompt: (content) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await module.exports.openai().chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `you are a data scientist. you can analysis any data and able to return json object as a output.
              you should follow this structure to generate the json object:
              {
                "suggest_project_name_in_one_word": "",
                "skills_max_5_based_on_project_expertise_demand_uniqueness": [
                  "skill_name"
                ],
                "domain_specialization_min_3_max_5": [],
                "project_description_max_500": ""
              }
              `,
            },
            {
              role: "user",
              content: `do a resume parsing on this:${content} and return a JSON object`,
            },
          ],
          temperature: 0.1,
          max_tokens: 600,
        });
        resolve(response);
      } catch (error) {
        console.log({ error });
        reject(error);
      }
    });
  },

  openai_project_specific_employees_prompt: (projectInfo, employeesInfo) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await module.exports.openai().chat.completions.create({
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "system",
              content: `you are a data scientist. you can analysis any data and able to return json object as a output.
              you should follow this structure to generate the json object:
              { 
                "suitable_employees_based_on_skills_experience_domain_specialization_max_5": [
                  {
                    employee_name: "",
                    rating_based_on_skills_project_experience_domain_specialization_role_for_this_project_max_100: 0,
                    descrice_why_employee_is_suitable_for_this_project_max_200_characters: ""
                  }
                ],
               
              }
              `,
            },
            {
              role: "user",
              content: `do a resume parsing on this:${projectInfo} projectInfo and this:${employeesInfo} employeeList and return a JSON object`,
            },
          ],
          temperature: 0.1,
          max_tokens: 8000,
        });
        resolve(response);
      } catch (error) {
        console.log({ error });
        reject(error);
      }
    });
  },

  prompt: async (req, res) => {
    const { content } = req.body;
    console.log({ content });
    const response = await module.exports.openai().chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content,
        },
      ],
      temperature: 1,
      max_tokens: 256,
    });
    return res.status(200).send(response);
  },

  analysEmployee: async (req, res) => {
    const file = req.files[0];
    console.log("processFile request", req.files[0]);
    const { value, messages } = await mammoth.convertToHtml({
      path: file.path,
    });
    console.log({ value });
    // const response = await module.exports.openai_employee_prompt(value);
    const response = await module.exports.openai_employee_prompt(value);
    // console.log({ choices, messages: choices[0].message });
    // return res.status(200).send(choices[0].message);
    return res.status(200).send({ value, response });
  },

  analysProject: async (req, res) => {
    const file = req.files[0];
    const { value, messages } = await mammoth.convertToHtml({
      path: file.path,
    });
    const response = await module.exports.openai_project_prompt(value);
    return res.status(200).send({ value, response });
  },

  analysProjectSpecifiEmployees: async (req, res) => {
    const { projectInfo, employeesInfo } = req.body;
    const response =
      await module.exports.openai_project_specific_employees_prompt(
        projectInfo,
        employeesInfo
      );
    return res.status(200).send({ response });
  },
};
