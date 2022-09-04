import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';

import App from './App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

Sentry.init({
  dsn: 'https://73df6f3bf6304f518d809cc18f287daa@sentry.io/6711675',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
/**
 * sentry 一些核心概念
 * 事件 event, 表示一个错误 error 或者一个事务 transaction
 * 错误 error，表示代码中的异常，sentry默认会自动捕获未被代码捕获的异常
 * 问题 issues，表示同一类错误，sentry会自动把一些原因相同或者同一处发生的异常自动归为一类问题
 * 事务 transaction，表示要测量的一个对象，例如一个异步任务，一个api请求，页面load时间等等，每个transaction有自己的名字，sentry根据名字对其分类
 * 环境和版本：environment and release
 * 性能监控：sentry使用分布式的概念来追踪性能指标，追踪trace通常由几个transaction组成，每个transaction又由几个spans组成，以一个api请求为例，追踪它的性能可以由前端发送请求，网关或负载均衡处理请求，后端程序处理并返回数据等几个部分，每个部分就是一个transaction，对于前端，还可以进一步追踪请求参数的处理，请求发送并获得响应等过程，这被称为span（https://docs.sentry.io/static/1ae959bb1d05b01379cf856c5dc36a01/d61c2/diagram-transaction-trace.png），一个span还可以向下细分为child span，所以实际上一次追踪是由一个root span和多个child span组成的一个树状结构
 * 来自官网的例子，一个站点从访问到用户可见的过程太慢，如何追踪
 * 分析整个访问过程，可以分为三个transaction，前端需要追踪page load时间，后端需要追踪前端的请求（包括三个静态资源和两个json接口），数据库需要追踪访问时间；对于前端来说追踪页面性能需要一个root span来追踪时间，一个span来追踪静态资源的平均请求时间（代码资源和图片资源可以分成两个span），一个span来追踪接口（每个接口相当于一个child span）
 *  每个trace都有trace_id， transaction 和 span 本质上是一样的，每个transaction都有transaction_name，通常是有实际业务意义的值，例如api的path，task的name等，每个span包含以下属性：
 *  parent_span_id: 父span的id
    op: span的类型的简短描述，如 pageload，ui.react.mount，ui.react.render，resource.script等
    start_timestamp:开始时间
    end_timestamp: 结束时间
    description: 唯一的描述 (optional)
    status: 自定义的状态码 (optional)
    tags: 一系列的键值对 (optional)
    data: 额外的数据 (optional)
    一个例子是op: db.query, description: SELECT * FROM users WHERE last_active < %s, status: 200, tags: { name: '', table: '', function: middleware.auth.is_authenticated }
  span不能单独发送给sentry，当transaction结束时会整体发送给sentry

 添加性能指标：
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();

  // Record amount of memory used
  transaction.setMeasurement('memoryUsed', 123, 'byte');

  // Record time when Footer component renders on page
  transaction.setMeasurement('ui.footerComponent.render', 1.3, 'second');

 上报自定义transaction 
  const transaction = Sentry.startTransaction({ name: "test-transaction" });
  const span = transaction.startChild({ op: "functionX" }); // This function returns a Span
  // functionCallX
  span.finish(); // Remember that only finished spans will be sent with the transaction
  transaction.finish(); 

  全局对事件进行处理
  import { addGlobalEventProcessor } from "@sentry/react";

  addGlobalEventProcessor(event => {
    if (event.type === "transaction") {
      event.transaction = sanitizeTransactionName(event.transaction);
    }
    return event;
  });
 * 
 * 
 * 
 */

// 捕获错误   Sentry.captureException(err);
// 上报消息   Sentry.captureMessage("Something went wrong");
/**
 * 在上下文中上报错误，可以设置错误级别
 * Sentry.withScope(function(scope) {
    scope.setLevel("info");

    // The exception has the event level set by the scope (info).
    Sentry.captureException(new Error("custom error"));
  });
 */
/**
 * 可以为错误设置指纹，相同指纹的错误会被归为同一类
 * Sentry.withScope(function(scope) {
      // group errors together based on their request and response
      scope.setFingerprint([method, path, String(err.statusCode)]);
      Sentry.captureException(err);
    });
    // 也可以在事件发送之前，手动为其设置指纹
    Sentry.init({
      ...,
      beforeSend: function(event, hint) {
        const exception = hint.originalException;

        if (exception instanceof MyRPCError) {
          event.fingerprint = [
            '{{ default }}',
            String(exception.functionName),
            String(exception.errorCode)
          ];
        }

        return event;
      }
    });
 */

window.addEventListener('load', () => {
  const [{
    loadEventEnd, domContentLoadedEventEnd
  }] = performance.getEntriesByType('navigation')
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();

// // Record amount of memory used
// transaction.setMeasurement('memoryUsed', 123, 'byte');

// // Record time when Footer component renders on page
// transaction.setMeasurement('ui.footerComponent.render', 1.3, 'second');

// // Record amount of times localStorage was read
// transaction.setMeasurement('localStorageRead', 4);
})