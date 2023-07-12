export async function authorizer(data: any): Promise<any> {
}

export async function init(data: any): Promise<any> {
  const { userId } = data.request.body!
  data.state.private = {
    userId,
    orders: [],
  }
  return data
}

export async function getState(data: any): Promise<any> {
  return { statusCode: 200, body: data.state }
}

export async function getInstanceId(data: any): Promise<string> {
  return data.request.body!.userId ?? 'default'
}
