//Manager for getting locales, this is going to be called upon a lot so it's gotta be fast

import { getEngineConfig } from './ConfigurationManager';

const defaultLocale: string = 'en_US';
export function getDefaultLocale(): string {
	return defaultLocale;
}

export function initializeLocales() {
	//Called by main

	// Read the Shadow Engine config file
	// to get the configured language.
	let selectedLocale: string = getEngineConfig().language;

	//TODO FINSIH THIS
}

export const availableLocales = [
	{
		id: 'en_US',
		prettyName: 'English (USA)'
	},
	{
		id: 'es_MX',
		prettyName: 'Espanol (México/Mexico) [Spanish]'
	},
	{
		id: 'tr_TR',
		prettyName: 'Turkey (Turkey/Turkey) [Turkey]'
	}
];

export function getLocales(section: string) {}
