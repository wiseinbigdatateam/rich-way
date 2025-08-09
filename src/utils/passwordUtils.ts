import bcrypt from 'bcryptjs';

/**
 * 비밀번호를 안전하게 해시화합니다.
 * @param password - 원본 비밀번호
 * @returns 해시화된 비밀번호
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // saltRounds: 12 (보안과 성능의 균형)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('비밀번호 해시화 오류:', error);
    throw new Error('비밀번호 암호화에 실패했습니다.');
  }
};

/**
 * 비밀번호가 해시화된 비밀번호와 일치하는지 확인합니다.
 * @param password - 원본 비밀번호
 * @param hashedPassword - 해시화된 비밀번호
 * @returns 일치 여부
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('비밀번호 검증 오류:', error);
    return false;
  }
};

/**
 * 비밀번호 강도를 검증합니다.
 * @param password - 검증할 비밀번호
 * @returns 검증 결과 객체
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  let score = 0;

  // 최소 길이 검증
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다.');
  } else {
    score += 1;
  }

  // 대문자 포함 검증
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 소문자 포함 검증
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 숫자 포함 검증
  if (!/\d/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 특수문자 포함 검증
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 강도 평가
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * 비밀번호가 안전한지 확인하고 해시화합니다.
 * @param password - 원본 비밀번호
 * @returns 해시화된 비밀번호 또는 에러
 */
export const securePassword = async (password: string): Promise<{ success: boolean; hashedPassword?: string; errors?: string[] }> => {
  try {
    // 비밀번호 강도 검증
    const validation = validatePasswordStrength(password);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(password);
    
    return {
      success: true,
      hashedPassword
    };
  } catch (error) {
    console.error('비밀번호 보안 처리 오류:', error);
    return {
      success: false,
      errors: ['비밀번호 처리 중 오류가 발생했습니다.']
    };
  }
};
