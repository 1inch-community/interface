import { createTransport, HttpTransport, HttpTransportConfig, RpcRequestError, UrlRequiredError } from 'viem';
import { createBatchScheduler } from 'node_modules/viem/utils/promise/createBatchScheduler';
import { getHttpRpcClient } from 'viem/utils';
import type { RpcRequest } from 'viem/_types/types/rpc';

// fork default viem http transport
// needed to reduce requests for infura and similar paid web3 node
// !!!do NOT use for public web3 node!!!
export function viemCustomHttpTransport(
  /** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
  url?: string | undefined,
  config: HttpTransportConfig = {},
): HttpTransport {
  const {
    batch,
    fetchOptions,
    key = 'http',
    name = 'HTTP JSON-RPC',
    onFetchRequest,
    onFetchResponse,
    retryDelay,
  } = config
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1000, wait = 0 } =
      typeof batch === 'object' ? batch : {}
    const retryCount = config.retryCount ?? retryCount_
    const timeout = timeout_ ?? config.timeout ?? 10_000
    const url_ = url || chain?.rpcUrls.default.http[0]
    if (!url_) throw new UrlRequiredError()

    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout,
    })

    return createTransport(
      {
        key,
        name,
        async request({ method, params }) {
          if (interceptMethods[method]) {
            return interceptMethods[method]()
          }
          const body = { method, params }

          const { schedule } = createBatchScheduler({
            id: url_,
            wait,
            shouldSplitBatch(requests) {
              return requests.length > batchSize
            },
            fn: (body: RpcRequest[]) =>
              rpcClient.request({
                body,
              }),
            sort: (a, b) => a.id - b.id,
          })

          const fn = async (body: RpcRequest) =>
            batch
              ? schedule(body)
              : [
                await rpcClient.request({
                  body,
                }),
              ]

          const [{ error, result }] = await fn(body)
          if (error)
            throw new RpcRequestError({
              body,
              error,
              url: url_,
            })
          return result
        },
        retryCount,
        retryDelay,
        timeout,
        type: 'http',
      },
      {
        fetchOptions,
        url: url_,
      },
    )
  }
}

const interceptMethods: Record<string, (() => any)> = {
  'net_listening': () => true
}
