import test from 'ava'
import { classIdentities, dependencyNames, fraudMethods, indexMethods, methodTypes } from '../../types'
import yaml from 'js-yaml'
import fs from 'fs'
import z from 'zod'
import { diff } from 'just-diff'

async function getHandler(fileName: string, methodName: string) { // checks whether a method is in same ts as template
  try {
    const method = (await import(`../${fileName}`))[methodName].name
    return `${fileName}.${method}`
  } catch (e) {
    console.log(e)
  }
}

const methodObject = z.object({
  method: z.string(),
  type: methodTypes,
  handler: z.string(),
  inputModel: z.string().optional(),
  queryStringModel: z.string().optional(),
  outputModel: z.string().optional(),
  errorModel: z.string().optional(),
  description: z.string().optional(),
  schedule: z.string().optional(),
})

export type MethodObject = z.infer<typeof methodObject>

function getMethodObject({ method, type, handler, inputModel, outputModel, errorModel, description, queryStringModel, schedule }: MethodObject) {
  const methodObject = {
    method,
    type,
    handler,
  }
  if (inputModel) methodObject['inputModel'] = inputModel
  if (outputModel) methodObject['outputModel'] = outputModel
  if (errorModel) methodObject['errorModel'] = errorModel
  if (description) methodObject['description'] = description
  if (queryStringModel) methodObject['queryStringModel'] = queryStringModel
  if (schedule) methodObject['schedule'] = schedule

  return methodObject
}

export const fraudFiles = z.enum(['index', 'fraud'])

async function getTemplate() {
  return {
    [indexMethods.enum.authorizer]: `${await getHandler(fraudFiles.enum.index, indexMethods.enum.authorizer)}`,
    [indexMethods.enum.init]: { handler: `${await getHandler(fraudFiles.enum.index, indexMethods.enum.init)}`, inputModel: 'FraudInitInput' },
    [indexMethods.enum.getState]: `${await getHandler(fraudFiles.enum.index, indexMethods.enum.getState)}`,
    [indexMethods.enum.getInstanceId]: `${await getHandler(fraudFiles.enum.index, indexMethods.enum.getInstanceId)}`,
    dependencies: [dependencyNames.enum.utils, dependencyNames.enum['config-layer']],
    methods: [
      getMethodObject({
        method: fraudMethods.enum.check,
        description: 'Checks limits\n',
        inputModel: 'CheckFraudInput',
        type: methodTypes.enum.READ,
        handler: `${await getHandler(fraudFiles.enum.fraud, fraudMethods.enum.check)}`,
      }),
      getMethodObject({
        method: fraudMethods.enum.add,
        description: 'Add new fraud data\n',
        inputModel: 'AddFraudInput',
        type: methodTypes.enum.WRITE,
        handler: `${await getHandler(fraudFiles.enum.fraud, fraudMethods.enum.add)}`,
      }),
    ]
  }
}

test.serial('verify template', async (t) => {
  try {
    const doc = yaml.load(fs.readFileSync(`classes/${classIdentities.enum.Fraud}/template.yml`, 'utf8'))
    t.deepEqual(doc, await getTemplate())
  } catch (e) {
    const doc = yaml.load(fs.readFileSync(`classes/${classIdentities.enum.Fraud}/template.yml`, 'utf8')) as object
    diff(doc, await getTemplate())
  }
})
