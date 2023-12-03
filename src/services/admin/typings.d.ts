declare namespace API {
  type AuthorizeRequest = {
    apiIDS?: string[];
    menuIDS?: string[];
    roleID?: string;
  };

  type deleteRolesIdParams = {
    /** id */
    id: string;
  };

  type GenerateParams = {
    params?: Record<string, any>;
    repo: string;
    service?: string;
  };

  type getGithubCallbackParams = {
    /** code */
    code: string;
    /** state */
    state: string;
  };

  type getGithubGetLoginUrlParams = {
    /** state */
    state: string;
  };

  type getMenuAuthorizeIdParams = {
    /** id */
    id: string;
  };

  type getRolesParams = {
    /** page */
    page?: number;
    /** pageSize */
    page_size?: number;
    /** id */
    id?: string;
    /** name */
    name?: string;
    /** status */
    status?: number;
    /** remark */
    remark?: string;
  };

  type getTemplateGetBranchesParams = {
    /** template source */
    source: string;
    /** access token */
    accessToken?: string;
  };

  type getTemplateGetParamsParams = {
    /** template source */
    source: string;
    /** branch default:HEAD */
    branch?: string;
    /** path default:. */
    path?: string;
    /** access token */
    accessToken?: string;
  };

  type getTemplateGetPathParams = {
    /** template source */
    source: string;
    /** branch default:HEAD */
    branch?: string;
    /** access token */
    accessToken?: string;
  };

  type getUserUserInfoParams = {
    /** id */
    id: string;
  };

  type GithubControlReq = {
    /** github密码或者token */
    password: string;
  };

  type GithubGetResp = {
    /** 已配置 */
    configured?: boolean;
    /** 创建时间 */
    createdAt?: string;
    /** github邮箱 */
    email?: string;
    /** 更新时间 */
    updatedAt?: string;
  };

  type GithubToken = {
    /** AccessToken is the token that authorizes and authenticates
the requests. */
    accessToken?: string;
    /** Expiry is the optional expiration time of the access token.

If zero, TokenSource implementations will reuse the same
token forever and RefreshToken or equivalent
mechanisms for that TokenSource will not be used. */
    expiry?: string;
    /** RefreshToken is a token that's used by the application
(as opposed to the user) to refresh the access token
if it expires. */
    refreshToken?: string;
    /** TokenType is the type of token.
The Type method returns either this or "Bearer", the default. */
    tokenType?: string;
  };

  type MenuSingle = {
    breadcrumb?: boolean;
    /** CreatedAt create time */
    createdAt?: string;
    /** ID primary key */
    id?: string;
    ignore?: boolean;
    key?: string;
    name?: string;
    parentId?: string;
    select?: boolean;
    title?: string;
    /** UpdatedAt update time */
    updatedAt?: string;
  };

  type Page = {
    current?: number;
    pageSize?: number;
    total?: number;
  };

  type putMenuAuthorizeIdParams = {
    /** id */
    id: string;
  };

  type putRolesIdParams = {
    /** id */
    id: string;
  };

  type Response = {
    code?: number;
    errorCode?: string;
    errorMessage?: string;
    host?: string;
    showType?: number;
    status?: string;
    success?: boolean;
    traceId?: string;
  };

  type Role = {
    /** CreatedAt create time */
    createdAt?: string;
    /** ID primary key */
    id?: string;
    name?: string;
    remark?: string;
    root?: boolean;
    status?: number;
    /** UpdatedAt update time */
    updatedAt?: string;
  };

  type TemplateGenerateReq = {
    accessToken?: string;
    email?: string;
    generate?: GenerateParams;
    template?: TemplateParams;
  };

  type TemplateGenerateResp = {
    branch?: string;
    repo?: string;
  };

  type TemplateGetBranchesResp = {
    branches?: string[];
  };

  type TemplateGetParamsResp = {
    params?: TemplateParam[];
  };

  type TemplateGetPathResp = {
    path?: string[];
  };

  type TemplateParam = {
    name?: string;
    tip?: string;
  };

  type TemplateParams = {
    branch?: string;
    path?: string;
    source: string;
  };

  type UpdateAuthorizeRequest = {
    keys: string[];
    roleID: string;
  };

  type User = {
    accountId?: string;
    avatar?: string;
    /** CreatedAt create time */
    createdAt?: string;
    email?: string;
    /** ID primary key */
    id?: string;
    introduction?: string;
    job?: string;
    jobName?: string;
    location?: string;
    locationName?: string;
    name?: string;
    organization?: string;
    organizationName?: string;
    password?: string;
    permissions?: Record<string, any>;
    personalWebsite?: string;
    phoneNumber?: string;
    registrationTime?: string;
    roleId?: string;
    status?: number;
    /** UpdatedAt update time */
    updatedAt?: string;
    username?: string;
    verified?: boolean;
  };
}
