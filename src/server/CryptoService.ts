import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

interface EncryptedData {
	encryptedText: string;
	iv: string;
}

export class CryptoService {
	private readonly algorithm = 'aes-256-cbc';
	private readonly key: Buffer;

	constructor(encryptionKey: string) {
		this.key = Buffer.from(encryptionKey, 'hex');
	}

	encrypt(text: string): EncryptedData {
		const iv = randomBytes(16);
		
		const cipher = createCipheriv(this.algorithm, this.key, iv);
		
		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		return {
			encryptedText: encrypted,
			iv: iv.toString('hex')
		};
	}

	decrypt(encryptedData: EncryptedData): string {
		const iv = Buffer.from(encryptedData.iv, 'hex');
		
		const decipher = createDecipheriv(this.algorithm, this.key, iv);
		
		let decrypted = decipher.update(encryptedData.encryptedText, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		
		return decrypted;
	}
}

export function generateEncryptionKey(): string {
	return randomBytes(32).toString('hex');
}