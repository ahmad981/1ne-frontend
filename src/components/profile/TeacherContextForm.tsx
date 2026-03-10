import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../redux/http';
import endPoints from '../../redux/constant';
import { CustomInput, SelectDropdown } from '../shared';

const SUGGESTED_GOALS = [
  'classroom engagement',
  'differentiation',
  'assessment',
  'automation',
  'lesson planning',
];

const defaultForm = {
  country: '',
  region: '',
  school_type: '',
  grade_band: '',
  subjects: [],
  language_preference: '',
  school_name: '',
  city: '',
  postal_code: '',
  curriculum_framework: '',
  years_experience: '',
  professional_goals: [],
};

export type TeacherContextFormValue = typeof defaultForm & {
  professional_goals?: string[];
};

type TeacherContextFormProps = {
  value: TeacherContextFormValue;
  onChange: (value: TeacherContextFormValue) => void;
  errors: Record<string, string>;
  disabled?: boolean;
  showOptional?: boolean;
};

export function TeacherContextForm({
  value,
  onChange,
  errors,
  disabled = false,
  showOptional = true,
}: TeacherContextFormProps) {
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([]);
  const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);
  const [curriculums, setCurriculums] = useState<{ value: string; label: string }[]>([]);
  const [gradeBands, setGradeBands] = useState<{ value: string; label: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ value: string; label: string }[]>([]);
  const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
  const [yearsExp, setYearsExp] = useState<{ value: string; label: string }[]>([]);
  const [tagInput, setTagInput] = useState('');

  const loadMetadata = useCallback(async () => {
    try {
      const [countriesRes, subjectsRes, curriculumsRes, gradeBandsRes, schoolTypesRes, languagesRes, yearsRes] =
        await Promise.all([
          axios.get(endPoints.metadataCountries),
          axios.get(endPoints.metadataSubjects),
          axios.get(endPoints.metadataCurriculums),
          axios.get(endPoints.metadataGradeBands),
          axios.get(endPoints.metadataSchoolTypes),
          axios.get(endPoints.metadataLanguages),
          axios.get(endPoints.metadataYearsExperience),
        ]);
      setCountries(countriesRes.data ?? []);
      setSubjects(subjectsRes.data ?? []);
      setCurriculums(curriculumsRes.data ?? []);
      setGradeBands(gradeBandsRes.data ?? []);
      setSchoolTypes(schoolTypesRes.data ?? []);
      setLanguages(languagesRes.data ?? []);
      setYearsExp(yearsRes.data ?? []);
    } catch (e) {
      setSchoolTypes([
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'charter', label: 'Charter' },
        { value: 'international', label: 'International' },
        { value: 'other', label: 'Other' },
      ]);
      setGradeBands([
        { value: 'K-2', label: 'K-2' },
        { value: '3-5', label: '3-5' },
        { value: '6-8', label: '6-8' },
        { value: '9-12', label: '9-12' },
        { value: 'higher_ed', label: 'Higher Education' },
        { value: 'other', label: 'Other' },
      ]);
      setLanguages([{ value: 'en', label: 'English' }, { value: 'other', label: 'Other' }]);
      setYearsExp([
        { value: '0-2', label: '0-2' },
        { value: '3-5', label: '3-5' },
        { value: '6-10', label: '6-10' },
        { value: '10+', label: '10+' },
      ]);
    }
  }, []);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  useEffect(() => {
    if (value.country) {
      axios
        .get(endPoints.metadataRegions, { params: { country: value.country } })
        .then((res) => setRegions(res.data ?? []))
        .catch(() => setRegions([{ value: 'OTHER', label: 'Other' }]));
    } else {
      setRegions([]);
    }
  }, [value.country]);

  const handleChange = (name: string, val: unknown) => {
    if (name === 'subjects') {
      const selected = Array.isArray(val) ? (val as { value: string; label: string }[]).map((o) => o?.value ?? o) : [];
      onChange({ ...value, subjects: selected });
      return;
    }
    if (name === 'country') {
      onChange({ ...value, [name]: val, region: '' });
      return;
    }
    onChange({ ...value, [name]: val });
  };

  const handleSelectChange = (e: { target: { name: string; value: unknown } }) => {
    const raw = e.target.value;
    if (e.target.name === 'subjects') {
      handleChange(e.target.name, raw);
      return;
    }
    const normalized = typeof raw === 'object' && raw !== null && 'value' in (raw as object)
      ? (raw as { value: string }).value
      : raw;
    handleChange(e.target.name, normalized ?? '');
  };

  const addGoal = () => {
    const t = tagInput.trim();
    if (t && !(value.professional_goals ?? []).includes(t)) {
      onChange({ ...value, professional_goals: [...(value.professional_goals ?? []), t] });
      setTagInput('');
    }
  };

  const removeGoal = (goal: string) => {
    onChange({
      ...value,
      professional_goals: (value.professional_goals ?? []).filter((g) => g !== goal),
    });
  };

  const subjectOptions = subjects.map((s) => ({ value: s.value, label: s.label }));
  const subjectsValue = (value.subjects || []).map((v) => ({ value: v, label: subjects.find((s) => s.value === v)?.label ?? v }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectDropdown
          label="Country"
          name="country"
          value={value.country}
          onChange={handleSelectChange}
          options={countries}
          placeholder="Select country"
          required
          error={!!errors.country}
          errorMsg={errors.country ?? ''}
          disabled={disabled}
        />
        <SelectDropdown
          label="Region / State / Province"
          name="region"
          value={value.region}
          onChange={handleSelectChange}
          options={regions}
          placeholder="Select region"
          required
          error={!!errors.region}
          errorMsg={errors.region ?? ''}
          disabled={disabled}
        />
        <SelectDropdown
          label="School Type"
          name="school_type"
          value={value.school_type}
          onChange={handleSelectChange}
          options={schoolTypes}
          placeholder="Select school type"
          required
          error={!!errors.school_type}
          errorMsg={errors.school_type ?? ''}
          disabled={disabled}
        />
        <SelectDropdown
          label="Grade Band"
          name="grade_band"
          value={value.grade_band}
          onChange={handleSelectChange}
          options={gradeBands}
          placeholder="Select grade band"
          required
          error={!!errors.grade_band}
          errorMsg={errors.grade_band ?? ''}
          disabled={disabled}
        />
        <div className="md:col-span-2">
          <SelectDropdown
            label="Subjects Taught"
            name="subjects"
            value={subjectsValue}
            onChange={handleSelectChange}
            options={subjectOptions}
            placeholder="Select subjects"
            multiSelect
            required
            error={!!errors.subjects}
            errorMsg={errors.subjects ?? ''}
            disabled={disabled}
          />
        </div>
        <SelectDropdown
          label="Preferred Teaching Language"
          name="language_preference"
          value={value.language_preference}
          onChange={handleSelectChange}
          options={languages}
          placeholder="Select language"
          required
          error={!!errors.language_preference}
          errorMsg={errors.language_preference ?? ''}
          disabled={disabled}
        />
      </div>

      {showOptional && (
        <>
          <h3 className="text-sm font-semibold text-gray-700 mt-6">Optional (recommended)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="School Name"
              name="school_name"
              value={value.school_name ?? ''}
              onChange={(e) => handleChange('school_name', e.target.value)}
              disabled={disabled}
              placeholder="School name"
            />
            <CustomInput
              label="City / Area"
              name="city"
              value={value.city ?? ''}
              onChange={(e) => handleChange('city', e.target.value)}
              disabled={disabled}
              placeholder="City or area"
            />
            <CustomInput
              label="Postal Code"
              name="postal_code"
              value={value.postal_code ?? ''}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              disabled={disabled}
              placeholder="Postal code"
            />
            <SelectDropdown
              label="Curriculum Framework"
              name="curriculum_framework"
              value={value.curriculum_framework ?? ''}
              onChange={handleSelectChange}
              options={curriculums}
              placeholder="Select framework"
              disabled={disabled}
            />
            <SelectDropdown
              label="Years of Experience"
              name="years_experience"
              value={value.years_experience ?? ''}
              onChange={handleSelectChange}
              options={yearsExp}
              placeholder="Select range"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Goals / Pain Points</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(value.professional_goals ?? []).map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {g}
                  {!disabled && (
                    <button type="button" onClick={() => removeGoal(g)} className="hover:opacity-80" aria-label={`Remove ${g}`}>
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <CustomInput
                placeholder="e.g. classroom engagement, differentiation"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={addGoal}
                disabled={disabled}
                className="px-3 py-2 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Example tags: {SUGGESTED_GOALS.join(', ')}</p>
          </div>
        </>
      )}
    </div>
  );
}

export const getDefaultTeacherContextForm = (): TeacherContextFormValue => ({ ...defaultForm });

export function validateTeacherContext(value: TeacherContextFormValue): Record<string, string> {
  const err: Record<string, string> = {};
  if (!value.country?.trim()) err.country = 'Country is required';
  if (!value.region?.trim()) err.region = 'Region is required';
  if (!value.school_type?.trim()) err.school_type = 'School type is required';
  if (!value.grade_band?.trim()) err.grade_band = 'Grade band is required';
  if (!value.subjects?.length) err.subjects = 'At least one subject is required';
  if (!value.language_preference?.trim()) err.language_preference = 'Language preference is required';
  return err;
}
