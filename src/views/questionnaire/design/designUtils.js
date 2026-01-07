import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';


function parseDSLText(dslText) {
  const lines = dslText.split(/\r?\n/);

  const arr = [];

  let currentDSL = null;

  for (const lineRaw of lines) {
    const line = lineRaw.trim();

    if (!line) {
      if (currentDSL) {
        arr.push(currentDSL);
      }

      // 空行，表示一个题目块结束，断开关联
      currentDSL = null;
      continue;
    }

    if (line.startsWith('- ')) {
      // 选项行，只要有题目在处理，就加选项
      if (currentDSL) {
        currentDSL += `\n${line}`;
      }

      continue;
    }

    currentDSL = line;
  }

  return arr;
}

function parseDSLToQuestion(dslText) {
  // 解析题目行，拿到题目类型（例如[单选]）
  const typeMatch = dslText.match(/\[(.+?)\]/); // 简单示例，最好用更精准的正则

  if (!typeMatch) {
    return null;
  }

  const dslType = typeMatch ? typeMatch[1] : null;

  if (!dslType) {
    return null;
  }

  let question = null;

  const modules = MaterielFactory.getModules();

  for (const key in modules) {
    const materiel = new modules[key]();

    if (materiel.title === dslType) {
      question = materiel;
      question.setDSL(dslText);

      //  找到匹配的组件，结束循环
      break;
    }
  }

  return question;
}

function parseDSL(dslText) {

  const dslList = parseDSLText(dslText);

  const questions = [];

  dslList.forEach(dsl => {
    const question = parseDSLToQuestion(dsl);

    if (question) {
      questions.push(question);
    }
  });

  return questions;
}


export default {
  parseDSL
};