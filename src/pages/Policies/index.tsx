import { PolicyLayout } from './PolicyLayout';
import { policies } from '@/data/policies';

export const PrivacyPage = () => <PolicyLayout policy={policies.privacy} />;
export const TermsPage = () => <PolicyLayout policy={policies.terms} />;
export const ShippingPage = () => <PolicyLayout policy={policies.shipping} />;
export const ReturnsPage = () => <PolicyLayout policy={policies.returns} />;
export const RefundsPage = () => <PolicyLayout policy={policies.refunds} />;
export const CancellationPage = () => <PolicyLayout policy={policies.cancellation} />;
export const CustomDesignPolicyPage = () => <PolicyLayout policy={policies['custom-design-policy']} />;
