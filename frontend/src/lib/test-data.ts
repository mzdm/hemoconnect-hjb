export interface TestDataRaw {
    confidence: string;
    has_unit: boolean;
    key: string;
    original_tag: string;
    title: string;
    type: string;
    unit: string;
    value: string;
}

export interface TestData {
    confidence: number;
    has_unit: boolean;
    key: string;
    original_tag: string;
    title: string;
    type: string;
    unit: string;
    value: string | number;
}

export const tIsNumber = (value: string | number): value is number => !Number.isNaN(parseFloat(value as string))

export function parseTestData(data: TestDataRaw[]): TestData[] {
    return data.map((item) => ({
        ...item,
        confidence: parseFloat(item.confidence) * 100,
        value: item.type === "number" || tIsNumber(item.value) ? parseFloat(item.value) : item.value
    }))
}

export function cutoffUnconfident(data: TestData[], threshold: number): TestData[] {
    return data.filter((item) => item.confidence >= threshold*100)
}

export const testData: TestDataRaw[] = [
    {
        "confidence": ".31308234007271490417",
        "has_unit": false,
        "key": "FormTitle",
        "original_tag": "FormTitle",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Diagnostický formulář"
    },
    {
        "confidence": ".30031166056153013599",
        "has_unit": true,
        "key": "Urea",
        "original_tag": "Urea",
        "title": "Klinické stádium (Rai)",
        "type": "number",
        "unit": "8",
        "value": "6."
    },
    {
        "confidence": ".32012864762426229692",
        "has_unit": true,
        "key": "Kreatinin",
        "original_tag": "Kreatinin",
        "title": "Hemoglobin",
        "type": "number",
        "unit": "1",
        "value": "8"
    },
    {
        "confidence": ".29763109964203487978",
        "has_unit": true,
        "key": "KM S-Kys.močová",
        "original_tag": "KM S-Kys.močová",
        "title": "B symptomy",
        "type": "number",
        "unit": "9",
        "value": "2"
    },
    {
        "confidence": ".31628122868038177628",
        "has_unit": true,
        "key": "Na S-Na",
        "original_tag": "Na S-Na",
        "title": "B symptomy",
        "type": "number",
        "unit": "7",
        "value": "13"
    },
    {
        "confidence": ".39813388322369641647",
        "has_unit": true,
        "key": "K S-K",
        "original_tag": "K S-K",
        "title": "B symptomy",
        "type": "number",
        "unit": "4",
        "value": "."
    },
    {
        "confidence": ".27608731510969819478",
        "has_unit": true,
        "key": "Cl S-Cl",
        "original_tag": "Cl S-Cl",
        "title": "CIRS skóre známo",
        "type": "number",
        "unit": "2",
        "value": "10"
    },
    {
        "confidence": ".35354915418916516012",
        "has_unit": true,
        "key": "Bi-celk. S-Bilirubin celk",
        "original_tag": "Bi-celk. S-Bilirubin celk",
        "title": "Hemoglobin",
        "type": "number",
        "unit": "7",
        "value": "11."
    },
    {
        "confidence": ".40487435627613810318",
        "has_unit": true,
        "key": "ALT S-ALT",
        "original_tag": "ALT S-ALT",
        "title": "Trombocyty",
        "type": "number",
        "unit": "8",
        "value": "0.1"
    },
    {
        "confidence": ".41011627242549580918",
        "has_unit": true,
        "key": "AST S-AST",
        "original_tag": "AST S-AST",
        "title": "Trombocyty",
        "type": "number",
        "unit": "8",
        "value": "0.2"
    },
    {
        "confidence": ".48511351701426241866",
        "has_unit": true,
        "key": "GGT S-GMT",
        "original_tag": "GGT S-GMT",
        "title": "Hemoglobin",
        "type": "number",
        "unit": "5",
        "value": "0.1"
    },
    {
        "confidence": ".48392696390886347224",
        "has_unit": true,
        "key": "ALP S-ALP",
        "original_tag": "ALP S-ALP",
        "title": "Trombocyty",
        "type": "number",
        "unit": "7",
        "value": "0."
    },
    {
        "confidence": ".45166533908915396101",
        "has_unit": true,
        "key": "LD S-LD",
        "original_tag": "LD S-LD",
        "title": "Trombocyty",
        "type": "number",
        "unit": "7",
        "value": "2.1"
    },
    {
        "confidence": ".34317844998314539496",
        "has_unit": true,
        "key": "Glukóza S-Glukosa",
        "original_tag": "Glukóza S-Glukosa",
        "title": "Hemoglobin",
        "type": "number",
        "unit": "9",
        "value": "5."
    },
    {
        "confidence": ".38661352810832383397",
        "has_unit": true,
        "key": "CRP S-CRP",
        "original_tag": "CRP S-CRP",
        "title": "CIRS skóre známo",
        "type": "number",
        "unit": "1",
        "value": "."
    },
    {
        "confidence": ".99999895235786528946",
        "has_unit": true,
        "key": "HGB",
        "original_tag": "HGB",
        "title": "Hemoglobin",
        "type": "number",
        "unit": "0",
        "value": "13."
    },
    {
        "confidence": "1",
        "has_unit": true,
        "key": "WBC",
        "original_tag": "WBC",
        "title": "Leukocyty",
        "type": "number",
        "unit": "0",
        "value": "19.83"
    },
    {
        "confidence": ".62832779921964132531",
        "has_unit": true,
        "key": "RBC",
        "original_tag": "RBC",
        "title": "Leukocyty",
        "type": "number",
        "unit": "1",
        "value": "4.4"
    },
    {
        "confidence": "1",
        "has_unit": true,
        "key": "PLT",
        "original_tag": "PLT",
        "title": "Trombocyty",
        "type": "number",
        "unit": "0",
        "value": "111."
    },
    {
        "confidence": ".29828057785781220134",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza1",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Chronická lymfatická leukémie"
    },
    {
        "confidence": ".31203659500372998847",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza2",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Pseudohyperkalémie"
    },
    {
        "confidence": ".30238739132020758804",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza3",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Chronická renální insuficience"
    },
    {
        "confidence": ".28535472257652094718",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza4",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Cysta levé ledviny"
    },
    {
        "confidence": ".30970246799356665468",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza5",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "DM 2. typu"
    },
    {
        "confidence": ".27319690803701712766",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza6",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Hypertenze"
    },
    {
        "confidence": ".27660027460491409811",
        "has_unit": false,
        "key": "Diagnoza",
        "original_tag": "Diagnoza7",
        "title": "Trombocyty",
        "type": "string",
        "unit": "",
        "value": "Alergie propolis"
    }
]