import { z } from 'zod'

export const classIdentities = z.enum(['Fraud'])

export const fraudMethods = z.enum(['add', 'check'])

export const indexMethods = z.enum(['authorizer', 'getState', 'init', 'getInstanceId'])

export const dependencyNames = z.enum(['utils', 'config-layer'])

export const methodTypes = z.enum(['READ', 'STATIC', 'WRITE'])