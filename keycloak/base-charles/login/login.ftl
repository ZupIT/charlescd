<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "header">
        ${msg("doLogIn")}
    <#elseif section = "form">
    <div id="kc-form" <#if realm.password && social.providers??>class="${properties.kcContentWrapperClass!}"</#if>>
      <div id="kc-form-wrapper" <#if realm.password && social.providers??>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
        <#if realm.password>
            <form class="form" id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post" autocomplete="off">
                <div class="logo-charlescd"></div>
                <div class="field">
                    <input
                    id="username"
                    type="text"
                    name="username"
                    class="input"
                    autocomplete="off"
                    required
                    />
                <label for="username" class="label">${msg("loginUsername")}</label>
                </div>
                <div class="field">
                    <input
                    id="password"
                    type="password"
                    name="password"
                    class="input"
                    autocomplete="off"
                    required
                    />
                    <label for="password" class="label">${msg("loginUsername")}</label>
                </div>
                <div class="field">
                    <input type="submit" value="Continue" class="submit" />
                </div>
                <span class="footer">
                    Developed with <span class="love"></span> by <span class="logo-zup"></span>
                </span>
            </form>
        </#if>
        </div>
        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}">
                <ul class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 4>${properties.kcFormSocialAccountDoubleListClass!}</#if>">
                    <#list social.providers as p>
                        <li class="${properties.kcFormSocialAccountListLinkClass!}"><a href="${p.loginUrl}" id="zocial-${p.alias}" class="zocial ${p.providerId}"> <span>${p.displayName}</span></a></li>
                    </#list>
                </ul>
            </div>
        </#if>
      </div>
    <#elseif section = "info" >
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
