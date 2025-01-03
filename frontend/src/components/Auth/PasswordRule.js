// components/UI/PasswordRules.js
export function PasswordRules({ rules }) {
  const checkIcon = (condition) => (condition ? "✓" : "×");
  return (
    <div className="mt-2 text-sm">
      <p className="text-gray-500 mb-1">Password must contain:</p>
      <ul className="space-y-1 pl-2">
        <li
          className={`${rules.hasLength ? "text-green-600" : "text-red-600"}`}
        >
          {checkIcon(rules.hasLength)} At least 8 characters
        </li>
        <li
          className={`${
            rules.hasUpperCase ? "text-green-600" : "text-red-600"
          }`}
        >
          {checkIcon(rules.hasUpperCase)} One uppercase letter
        </li>
        <li
          className={`${
            rules.hasLowerCase ? "text-green-600" : "text-red-600"
          }`}
        >
          {checkIcon(rules.hasLowerCase)} One lowercase letter
        </li>
        <li
          className={`${rules.hasNumber ? "text-green-600" : "text-red-600"}`}
        >
          {checkIcon(rules.hasNumber)} One number
        </li>
        <li
          className={`${rules.hasSpecial ? "text-green-600" : "text-red-600"}`}
        >
          {checkIcon(rules.hasSpecial)} One special character (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
}
