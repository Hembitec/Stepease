module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},84199,(e,t,r)=>{"use strict";var a=Object.defineProperty,n=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,s=Object.prototype.hasOwnProperty,i={},l={VercelOidcTokenError:()=>d};for(var u in l)a(i,u,{get:l[u],enumerable:!0});t.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let r of o(t))s.call(e,r)||void 0===r||a(e,r,{get:()=>t[r],enumerable:!(i=n(t,r))||i.enumerable});return e})(a({},"__esModule",{value:!0}),i);class d extends Error{constructor(e,t){super(e),this.name="VercelOidcTokenError",this.cause=t}toString(){return this.cause?`${this.name}: ${this.message}: ${this.cause}`:`${this.name}: ${this.message}`}}},22733,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),s=e.i(14444),i=e.i(37092),l=e.i(69741),u=e.i(16795),d=e.i(87718),c=e.i(95169),p=e.i(47587),h=e.i(66012),m=e.i(70101),f=e.i(74838),g=e.i(10372),v=e.i(93695);e.i(52474);var R=e.i(220),w=e.i(12075),x=e.i(11227);let b=`You are an expert technical writer specializing in creating comprehensive Standard Operating Procedures (SOPs). Your task is to generate a complete, professional SOP document from the provided conversation notes.

## Output Format
Generate the SOP in clean Markdown format with the following structure:

# [SOP Title]

**Document ID:** SOP-[CATEGORY]-[NUMBER]
**Version:** 1.0
**Effective Date:** [Current Date]
**Last Reviewed:** [Current Date]
**Document Owner:** [From notes or "To be assigned"]
**Approved By:** [From notes or "Pending approval"]

---

## 1. Purpose
[Clear statement of why this procedure exists and what it accomplishes]

## 2. Scope
[Define what/who this SOP applies to and any exclusions]

## 3. Responsibilities
[List each role and their specific responsibilities in a table format]

| Role | Responsibilities |
|------|-----------------|
| [Role 1] | [Responsibilities] |

## 4. Definitions
[Define key terms, acronyms, or technical language used]

## 5. Procedure

### 5.1 [First Major Step]
**Prerequisites:** [If any]
1. [Detailed sub-step]
2. [Detailed sub-step]

**Note:** [Important considerations]

### 5.2 [Second Major Step]
[Continue pattern...]

## 6. Quality Metrics & Success Criteria
[Measurable outcomes and KPIs]

## 7. Troubleshooting
[Common issues and resolutions in a table]

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| [Issue 1] | [Cause] | [Fix] |

## 8. Related Documents
[Links to related SOPs, forms, templates]

## 9. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial release |

---

## Writing Guidelines:
1. Use clear, action-oriented language (imperative mood)
2. One action per step
3. Include warnings/cautions where safety is concerned
4. Be specific with quantities, timeframes, and measurements
5. Avoid jargon unless defined
6. Include decision points with clear criteria
7. Add visual aids placeholders where helpful: [DIAGRAM: description]

Generate a thorough, professional SOP that could be immediately used in a real organization.`;async function y(e){try{var t;let{notes:r,title:a,description:n}=await e.json(),o=(t=function(e){let t={};for(let r of e){let e=r.category||"OTHER";t[e]||(t[e]=[]),t[e].push(r)}return t}(r),Object.entries(t).map(([e,t])=>{let r=t.map((e,t)=>{let r=`  ${t+1}. ${e.content}`;return e.relatedTo&&(r+=` (Related: ${e.relatedTo})`),e.action&&(r+=` - Action: ${e.action}`),r}).join("\n");return`### ${e.replace(/_/g," ")}
${r}`}).join("\n\n")),s=`Generate a complete SOP document based on these conversation notes:

${a?`**SOP Title:** ${a}`:""}
${n?`**Description:** ${n}`:""}

## Collected Information:

${o}

Please generate a comprehensive, well-structured SOP document in Markdown format following the standard SOP template. Make sure to:
1. Fill in all sections based on the notes provided
2. Infer reasonable details where information might be missing
3. Use professional language appropriate for an official document
4. Include placeholder markers [TBD] for any critical information that couldn't be determined
5. Add helpful notes and warnings where appropriate`;return(0,w.streamText)({model:(0,x.google)("gemini-3-flash-preview"),system:b,prompt:s,temperature:.3}).toTextStreamResponse()}catch(e){return console.error("Generate SOP API Error:",e),new Response(JSON.stringify({error:"Failed to generate SOP",details:e instanceof Error?e.message:"Unknown error"}),{status:500,headers:{"Content-Type":"application/json"}})}}e.s(["POST",()=>y,"maxDuration",0,60],4833);var O=e.i(4833);let P=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/chat/generate-sop/route",pathname:"/api/chat/generate-sop",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/chat/generate-sop/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:E,workUnitAsyncStorage:C,serverHooks:S}=P;function A(){return(0,a.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:C})}async function T(e,t,a){P.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/chat/generate-sop/route";w=w.replace(/\/index$/,"")||"/";let x=await P.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:y,nextConfig:O,parsedUrl:E,isDraftMode:C,prerenderManifest:S,routerServerContext:A,isOnDemandRevalidate:T,revalidateOnlyGenerated:D,resolvedPathname:k,clientReferenceManifest:j,serverActionsManifest:I}=x,_=(0,l.normalizeAppPath)(w),N=!!(S.dynamicRoutes[_]||S.routes[k]),M=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,E,!1):t.end("This page could not be found"),null);if(N&&!C){let e=!!S.routes[k],t=S.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(O.experimental.adapterPath)return await M();throw new v.NoFallbackError}}let $=null;!N||P.isDev||C||($="/index"===($=k)?"/":$);let q=!0===P.isDev||!N,U=N&&!q;I&&j&&(0,s.setReferenceManifestsSingleton)({page:w,clientReferenceManifest:j,serverActionsManifest:I,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:I})});let H=e.method||"GET",F=(0,o.getTracer)(),G=F.getActiveScopeSpan(),B={params:y,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:q,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:O.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>P.onRequestError(e,t,a,A)},sharedContext:{buildId:b}},K=new u.NodeNextRequest(e),L=new u.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let s=async e=>P.handle(V,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${H} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${w}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let u=async({previousCacheEntry:r})=>{try{if(!i&&T&&D&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=B.renderOpts.collectedTags;if(!N)return await (0,h.sendResponse)(K,L,o,B.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(o.headers);u&&(t[g.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},A),t}},d=await P.handleResponse({req:e,nextConfig:O,cacheKey:$,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:D,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:i});if(!N)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&N||c.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,f.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(K,L,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};G?await l(G):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${w}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})}),N)throw t;return await (0,h.sendResponse)(K,L,new Response(null,{status:500})),null}}e.s(["handler",()=>T,"patchFetch",()=>A,"routeModule",()=>P,"serverHooks",()=>S,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>C],22733)},67030,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0983279f._.js"].map(t=>e.l(t))).then(()=>t(83697)))},83671,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0ea05e0c._.js"].map(t=>e.l(t))).then(()=>t(90391)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__7c70315f._.js.map