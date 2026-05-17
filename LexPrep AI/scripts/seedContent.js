const { initDatabase, getDb } = require('../models/database');
const { v4: uuidv4 } = require('uuid');

const CONTENT = {
  "Constitutional Law": {
    bookId: "book-001",
    chapters: [
      {
        id: "topic-001",
        title: "Preamble & Basic Structure Doctrine",
        summary: "The Preamble declares India as a Sovereign, Socialist, Secular, Democratic Republic. The Basic Structure Doctrine (Kesavananda Bharati 1973) limits Parliament's amending power under Article 368.",
        difficulty: "hard",
        content: `## Chapter 1: Preamble & Basic Structure Doctrine

### 1.1 The Preamble - Soul of the Constitution

The Preamble to the Constitution of India is an introductory statement that sets out the guiding purpose, principles, and philosophy of the Constitution. It is often described as the "soul of the Constitution" and the "key to the minds of the makers of the Constitution."

#### Text of the Preamble

The Preamble reads:

> "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:
> 
> JUSTICE, social, economic and political;
> LIBERTY of thought, expression, belief, faith and worship;
> EQUALITY of status and of opportunity;
> and to promote among them all
> FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;
> 
> IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."

#### Historical Background

The Preamble is based on the "Objective Resolution" moved by Jawaharlal Nehru on December 13, 1946, and adopted by the Constituent Assembly on January 22, 1947. The draft of the Preamble was prepared by the Drafting Committee under the chairmanship of Dr. B.R. Ambedkar.

The phrase "We the People of India" signifies that the Constitution derives its authority from the people of India, establishing popular sovereignty. This reflects the democratic principle that the ultimate power rests with the citizens.

#### Key Terms Explained

**Sovereign:** India is neither a dependent territory nor a dominion of any external authority. It is free to conduct its internal and external affairs independently. The term means that India is not subordinate to any external power and has the authority to make decisions on its own.

**Socialist:** The term was added by the 42nd Amendment Act, 1976. It implies the achievement of socialist ends through a mixed economy where both public and private sectors coexist. Democratic socialism, as understood in the Indian context, does not mean complete nationalization but rather the elimination of poverty, ignorance, disease, and inequality of opportunity. The Supreme Court in *Excel Wear v. Union of India* (1978) noted that the addition of "Socialist" might enable the courts to uphold nationalization and lean more heavily in favor of public ownership.

**Secular:** Also added by the 42nd Amendment Act, 1976. Secularism in the Indian context means that the State has no religion and treats all religions equally. Unlike the Western concept of secularism (where religion is separate from State), Indian secularism ensures equal respect for all religions. The State can intervene in religious matters to remove social evils and ensure social justice. In *S.R. Bommai v. Union of India* (1994), the Supreme Court held that secularism is a basic feature of the Constitution.

**Democratic:** India follows a representative democracy based on universal adult suffrage. Every citizen above 18 years has the right to vote regardless of caste, creed, religion, sex, or education. The term "democratic" also encompasses political, social, and economic democracy.

**Republic:** The head of State (President) is elected and not a hereditary monarch. Every citizen is eligible to hold any public office regardless of their birth, religion, or social status.

#### Objectives of the Preamble

**Justice:** The Preamble secures three kinds of justice:
- *Social Justice:* Equal treatment of all citizens without discrimination. Elimination of social inequalities based on caste, creed, religion, and gender.
- *Economic Justice:* Equal pay for equal work, adequate means of livelihood, and equitable distribution of wealth.
- *Political Justice:* Equal political rights, including the right to vote, contest elections, and hold public office.

**Liberty:** The Preamble guarantees liberty of thought, expression, belief, faith, and worship. This liberty is not absolute but subject to reasonable restrictions in the interest of public order, morality, and security of the State.

**Equality:** The Preamble ensures equality of status and opportunity. This is given effect through Articles 14 to 18 of the Constitution, which guarantee equality before law, prohibition of discrimination, abolition of untouchability, and abolition of titles.

**Fraternity:** Fraternity means a sense of brotherhood and fellow-feeling among all citizens. It assuring the dignity of the individual and the unity and integrity of the Nation. The concept of fraternity is essential for maintaining national integration in a diverse country like India.

### 1.2 Is the Preamble a Part of the Constitution?

This question has been debated in two landmark cases:

**Berubari Union Case (1960):** The Supreme Court held that the Preamble is NOT a part of the Constitution. It is merely a key to understanding the Constitution but has no substantive legal force.

**Kesavananda Bharati Case (1973):** The Supreme Court overruled Berubari and held that the Preamble IS an integral part of the Constitution. It can be used to interpret ambiguous provisions of the Constitution. However, it is not a source of substantive power or a limitation on power.

**LIC of India Case (1995):** The Supreme Court reaffirmed that the Preamble is an integral part of the Constitution.

### 1.3 Amendability of the Preamble

In the *Kesavananda Bharati Case* (1973), the Supreme Court held that the Preamble can be amended under Article 368, provided the basic structure of the Constitution is not destroyed.

The Preamble has been amended only once - by the 42nd Amendment Act, 1976, which added three words: "Socialist," "Secular," and "Integrity" (later "and Integrity" was added to "unity").

### 1.4 Basic Structure Doctrine

#### Origin and Evolution

The Basic Structure Doctrine is one of the most significant contributions of the Indian judiciary to constitutional law. It emerged from the conflict between the Parliament and the Judiciary over the scope of the amending power under Article 368.

**Golaknath Case (1967):** In *I.C. Golaknath v. State of Punjab*, an 11-judge bench held by 6:5 majority that Fundamental Rights are "transcendental and immutable" and Parliament cannot abridge or take away any Fundamental Right through a constitutional amendment. This judgment led to the enactment of the 24th and 25th Amendments.

**Kesavananda Bharati Case (1973):** The Golaknath judgment was partially overruled in *Kesavananda Bharati v. State of Kerala*. A 13-judge bench (the largest ever) held by 7:6 majority that:
1. Parliament has the power to amend any part of the Constitution, including Fundamental Rights.
2. However, this power is not unlimited. Parliament cannot destroy or abrogate the "basic structure" or "essential features" of the Constitution.
3. The amending power under Article 368 is a constituent power, but it is subject to inherent limitations.

Justice H.R. Khanna's opinion was decisive. He held that while Parliament can amend Fundamental Rights, it cannot take away the core of these rights or destroy the basic structure.

#### Elements of Basic Structure

The Supreme Court did not provide an exhaustive list of basic structure elements. The list is illustrative, not exhaustive. Various judgments have identified the following elements:

1. **Supremacy of the Constitution** - The Constitution is the supreme law of the land.
2. **Sovereign, Democratic, and Republican nature of the Indian Polity** - India is a sovereign democratic republic.
3. **Secular character of the Constitution** - The State has no religion.
4. **Separation of powers** - Between the Legislature, Executive, and Judiciary.
5. **Federal character of the Constitution** - Distribution of powers between Centre and States.
6. **Judicial review** - Power of courts to review legislative and executive action.
7. **Rule of law** - Equality before law and supremacy of law.
8. **Dignity of the individual** - Protection of individual rights and freedoms.
9. **Parliamentary system of government** - Responsible government.
10. **Free and fair elections** - Essential for democracy.
11. **Welfare state** - Commitment to social and economic justice.
12. **Harmony between Fundamental Rights and Directive Principles** - Both are complementary.
13. **Effective access to justice** - Right to approach courts.
14. **Independence of the Judiciary** - Essential for rule of law.
15. **Limited power of Parliament to amend the Constitution** - Cannot destroy basic structure.

#### Subsequent Applications

**Indira Gandhi v. Raj Narain (1975):** The Supreme Court struck down the 39th Amendment Act, which placed the election of the Prime Minister beyond judicial scrutiny, as violating the basic structure (free and fair elections).

**Minerva Mills v. Union of India (1980):** The Court struck down parts of the 42nd Amendment that gave primacy to DPSP over Fundamental Rights, holding that harmony between FR and DPSP is part of the basic structure.

**Waman Rao v. Union of India (1981):** The Court held that the basic structure doctrine applies to all amendments made after the Kesavananda judgment (April 24, 1973).

**I.R. Coelho v. State of Tamil Nadu (2007):** A 9-judge bench unanimously held that laws placed in the 9th Schedule after April 24, 1973, are subject to judicial review if they violate the basic structure.

**Kihoto Hollohon v. Zachillhu (1992):** The Court upheld the Tenth Schedule (anti-defection law) but struck down the provision that excluded judicial review, holding that judicial review is part of the basic structure.

### 1.5 Significance for UP PCS-J Examination

The Basic Structure Doctrine is one of the most frequently tested topics in the UP PCS-J examination. Candidates must be prepared to:

1. Write a detailed essay on the evolution of the basic structure doctrine.
2. Discuss the conflict between Parliament and Judiciary over amending power.
3. Analyze whether the basic structure doctrine is a threat to parliamentary sovereignty.
4. List the elements of basic structure with supporting case law.
5. Critically examine the criticism that the basic structure doctrine is vague and undemocratic.

**Previous Year Question (UP PCS-J 2023):** "The Preamble is the key to unlock the mind of the makers of the Constitution." Discuss with reference to judicial interpretation.

**Previous Year Question (UP PCS-J 2022):** "The Basic Structure Doctrine is the greatest contribution of Indian judiciary to constitutional jurisprudence." Comment.

### 1.6 Critical Analysis

**Arguments in Favor:**
- Prevents authoritarian takeover through constitutional amendments.
- Protects the core democratic values of the Constitution.
- Ensures that the Constitution remains a living document with unalterable core values.

**Arguments Against:**
- The doctrine is vague and there is no clear definition of "basic structure."
- It gives unelected judges the power to strike down constitutional amendments.
- It undermines parliamentary sovereignty and democratic will.
- The Constitution itself does not mention any "basic structure" limitation.

Despite the criticism, the Basic Structure Doctrine has stood the test of time and remains one of the most important features of Indian constitutional law.`
      },
      {
        id: "topic-002",
        title: "Fundamental Rights - Articles 14 to 18 (Right to Equality)",
        summary: "Articles 14-18 guarantee Right to Equality. Article 14 has twin test of reasonable classification. Articles 15-18 prohibit discrimination, abolish untouchability and titles.",
        difficulty: "medium",
        content: `## Chapter 2: Fundamental Rights - Articles 14 to 18 (Right to Equality)

### 2.1 Introduction to Fundamental Rights

Fundamental Rights are enshrined in Part III of the Constitution (Articles 12 to 35). They are often described as the "Magna Carta of India" and form the cornerstone of Indian democracy. Dr. B.R. Ambedkar called them the "heart and soul of the Constitution."

#### Characteristics of Fundamental Rights:
1. They are guaranteed by the Constitution and cannot be taken away by ordinary legislation.
2. They are enforceable by the courts (Article 32).
3. They are not absolute but subject to reasonable restrictions.
4. They are available against the State (Article 12), not against private individuals (with some exceptions).
5. Some rights are available only to citizens (Articles 15, 16, 19, 29, 30), while others are available to all persons.
6. They can be suspended during a National Emergency (except Articles 20 and 21).

### 2.2 Article 14 - Equality Before Law and Equal Protection of Laws

**Text:** "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."

Article 14 contains two concepts:

#### (A) Equality Before Law
This is a negative concept derived from the English common law. It means that no person is above the law, irrespective of their status or position. Every person, whether rich or poor, high or low, is subject to the ordinary law of the land. The rule of law, as propounded by A.V. Dicey, has three elements:
1. Supremacy of law - No man is punishable except for a distinct breach of law.
2. Equality before law - Every person is subject to the ordinary law.
3. Predominance of legal spirit - Rights are secured by judicial decisions, not by constitutional guarantees.

#### (B) Equal Protection of Laws
This is a positive concept derived from the American Constitution (14th Amendment). It means that equals should be treated equally and unequals should be treated unequally. It permits reasonable classification but prohibits class legislation.

#### Doctrine of Reasonable Classification

For a classification to be reasonable, it must satisfy two tests (laid down in *State of West Bengal v. Anwar Ali Sarkar*, 1952):

1. **Intelligible Differentia:** The classification must be based on an intelligible differentia that distinguishes those grouped together from those left out. The differentia must be real and substantial.

2. **Rational Nexus:** The differentia must have a rational nexus (connection) with the object sought to be achieved by the statute.

**Example:** A law that provides for reservation in employment for Scheduled Castes and Scheduled Tribes is a reasonable classification because:
- Intelligible differentia: SC/ST are socially and educationally backward.
- Rational nexus: The object is to promote equality and remove historical disadvantages.

#### New Doctrine of Anti-Arbitrariness

In *E.P. Royappa v. State of Tamil Nadu* (1974), Justice Bhagwati expanded the scope of Article 14 by holding that equality is a dynamic concept and cannot be "cribbed, cabined and confined within traditional and doctrinaire limits." He held that Article 14 strikes at arbitrariness in State action.

In *Maneka Gandhi v. Union of India* (1978), the Supreme Court held that Article 14 is not confined to the doctrine of reasonable classification but also includes the principle of non-arbitrariness. A law that is arbitrary is necessarily unequal.

In *Indra Sawhney v. Union of India* (1992), the Court held that "rule of law" and "elimination of arbitrariness" are part of the basic structure of the Constitution.

#### Article 14 and Administrative Action

Article 14 applies not only to legislation but also to administrative action. In *Ajay Hasia v. Khalid Mujib* (1981), the Court held that every State action must be non-arbitrary and must satisfy the test of reasonableness under Article 14.

### 2.3 Article 15 - Prohibition of Discrimination

**Text:** "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them."

#### Key Features:
1. Available only to citizens.
2. Prohibits discrimination on the specified grounds only. The word "only" is significant - discrimination on other grounds is not prohibited.
3. Applies to State action as well as access to public places.

#### Exceptions to Article 15:

**Article 15(3):** The State can make special provisions for women and children. This enables affirmative action such as reservation for women in local bodies, maternity benefits, etc.

**Article 15(4):** Added by the 1st Amendment Act, 1951 (after *State of Madras v. Champakam Dorairajan*, 1951). The State can make special provisions for the advancement of socially and educationally backward classes, Scheduled Castes, and Scheduled Tribes.

**Article 15(5):** Added by the 93rd Amendment Act, 2005. The State can make special provisions for admission to educational institutions (including private unaided institutions, except minority institutions) for SC/ST/OBC.

**Article 15(6):** Added by the 103rd Amendment Act, 2019. The State can make special provisions for economically weaker sections (EWS) for admission to educational institutions and appointment to posts.

#### Landmark Cases:

**State of Madras v. Champakam Dorairajan (1951):** The Supreme Court struck down communal reservation in educational institutions, leading to the 1st Amendment and insertion of Article 15(4).

**Indra Sawhney v. Union of India (1992):** The Court upheld 27% reservation for OBCs in central government services but laid down certain guidelines:
- 50% cap on total reservation (with exceptions in extraordinary situations).
- Creamy layer exclusion for OBCs.
- No reservation in promotions (later overturned by 85th Amendment).
- Reservation should be based on caste as well as economic criteria.

**Jarnail Singh v. Lachhmi Narain Gupta (2018):** The Court held that creamy layer exclusion applies to SC/ST in promotions. The Court also held that SC/ST are presumed to be backward and no quantifiable data is needed for reservation in promotions.

### 2.4 Article 16 - Equality of Opportunity in Public Employment

**Text:** "There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State."

#### Key Features:
1. Available only to citizens.
2. Applies to "employment or appointment to any office under the State."
3. The State can prescribe reasonable qualifications for employment.

#### Exceptions:

**Article 16(3):** Parliament can prescribe residence as a condition for employment in a particular State. (No such law has been enacted yet.)

**Article 16(4):** The State can make provision for reservation in appointments or posts in favor of any backward class of citizens which, in the opinion of the State, is not adequately represented in the services under the State.

**Article 16(4A):** Added by the 85th Amendment Act, 2001. The State can make provision for reservation in matters of promotion, with consequential seniority, to any class or classes of posts in the services of the State in favor of SC/ST which are not adequately represented.

**Article 16(4B):** Added by the 81st Amendment Act, 2000. The unfilled reserved vacancies of a year can be carried forward to the next year without being counted against the 50% ceiling.

**Article 16(5):** The State can prescribe religious or denominational qualifications for appointments to religious institutions.

**Article 16(6):** Added by the 103rd Amendment Act, 2019. The State can make provision for reservation for economically weaker sections (EWS) up to 10% in addition to existing reservations.

#### Landmark Cases:

**Indra Sawhney v. Union of India (1992):** The Court upheld reservation in public employment but laid down the 50% cap rule, creamy layer exclusion, and no reservation in promotions.

**M. Nagaraj v. Union of India (2006):** The Court upheld the constitutional validity of Articles 16(4A) and 16(4B) but laid down three conditions for reservation in promotions:
1. Backwardness of the class.
2. Inadequacy of representation.
3. Maintenance of efficiency (Article 335).

### 2.5 Article 17 - Abolition of Untouchability

**Text:** "Untouchability" is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of "untouchability" shall be an offence punishable in accordance with law.

#### Key Features:
1. Absolute right - no exceptions.
2. "Untouchability" is not defined in the Constitution. It refers to the practice as it existed in pre-Constitution India.
3. The Protection of Civil Rights Act, 1955, and the SC/ST (Prevention of Atrocities) Act, 1989, give effect to this article.
4. The term "untouchability" has been given a wider meaning by the courts to include not just caste-based untouchability but also any practice that treats a person as inferior on the basis of birth.

#### Landmark Cases:

**People's Union for Democratic Rights v. Union of India (1982):** The Court held that the right under Article 17 is available against private individuals as well as the State.

**State of Karnataka v. Appa Balu Ingale (1995):** The Court held that Article 17 is an absolute right and any practice that treats a person as inferior on the basis of birth is prohibited.

### 2.6 Article 18 - Abolition of Titles

**Text:** "No title, not being a military or academic distinction, shall be conferred by the State. No citizen of India shall accept any title from any foreign State."

#### Key Features:
1. Prohibits the State from conferring titles (except military and academic distinctions).
2. Prohibits Indian citizens from accepting titles from foreign States.
3. The Bharat Ratna, Padma Vibhushan, Padma Bhushan, and Padma Shri are not "titles" within the meaning of Article 18, as held in *Balaji Raghavan v. Union of India* (1995). However, they cannot be used as prefixes or suffixes to names.

#### Landmark Cases:

**Balaji Raghavan v. Union of India (1995):** The Court upheld the validity of national awards but held that they cannot be used as titles. The awardees cannot use "Padma Shri" or "Bharat Ratna" as prefixes or suffixes to their names.

### 2.7 Golden Triangle - Articles 14, 19, and 21

In *Maneka Gandhi v. Union of India* (1978), the Supreme Court held that Articles 14, 19, and 21 are not mutually exclusive but form a "golden triangle." Any law depriving a person of personal liberty under Article 21 must also satisfy the requirements of Articles 14 and 19.

This means that a law that deprives a person of life or personal liberty must:
1. Not be arbitrary (Article 14).
2. Not unreasonably restrict any of the six freedoms (Article 19).
3. Prescribe a procedure that is fair, just, and reasonable (Article 21).

### 2.8 Previous Year Questions (UP PCS-J)

**2022:** Distinguish between "equality before law" and "equal protection of laws" with case law.

**2021:** "Article 15 permits classification but prohibits discrimination." Discuss with reference to reservation policy in India.

**2020:** Critically examine the 103rd Constitutional Amendment providing for EWS reservation.

**2019:** "The doctrine of reasonable classification has been expanded to include the principle of non-arbitrariness." Discuss.`
      },
      {
        id: "topic-003",
        title: "Fundamental Rights - Articles 19 to 22 (Six Freedoms, Life & Liberty)",
        summary: "Articles 19-22 cover six freedoms, protection against conviction, right to life (expanded by judiciary), and protection against arrest. Golden Triangle: Arts 14, 19, 21 interconnected.",
        difficulty: "medium",
        content: `## Chapter 3: Fundamental Rights - Articles 19 to 22

### 3.1 Article 19 - Protection of Six Freedoms

**Text:** "All citizens shall have the right - (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions or co-operative societies; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; and (g) to practice any profession, or to carry on any occupation, trade or business."

Note: Originally, Article 19 had seven freedoms. The right to acquire, hold, and dispose of property (Article 19(1)(f)) was deleted by the 44th Amendment Act, 1978.

#### (A) Freedom of Speech and Expression - Article 19(1)(a)

This is the most important of the six freedoms. The term "speech and expression" has been given a wide interpretation by the courts.

**Scope includes:**
- Freedom of press (implicit in freedom of speech)
- Right to information (RTI)
- Right to know
- Right to remain silent
- Right to broadcast and telecast
- Right to internet access
- Right to commercial advertisement
- Right against telephone tapping
- Right to fly the national flag

**Restrictions under Article 19(2):**
The State can impose reasonable restrictions on the following grounds only:
1. Sovereignty and integrity of India
2. Security of the State
3. Friendly relations with foreign States
4. Public order
5. Decency or morality
6. Contempt of court
7. Defamation
8. Incitement to an offence

**Landmark Cases:**

**Romesh Thappar v. State of Madras (1950):** The Supreme Court held that freedom of speech and expression includes freedom of propagation of ideas. The Court struck down a ban on a journal, holding that public order is not a ground for restriction under Article 19(2) (before the 1st Amendment).

**Brij Bhushan v. State of Delhi (1950):** The Court held that pre-censorship of a journal is a restriction on freedom of speech.

**Shreya Singhal v. Union of India (2015):** The Supreme Court struck down Section 66A of the IT Act, 2000, as unconstitutional. The Court held that the provision was vague and overbroad and violated Article 19(1)(a). The Court distinguished between "discussion," "advocacy," and "incitement" - only incitement can be restricted.

**Justice K.S. Puttaswamy v. Union of India (2017):** The Court held that the right to privacy is an intrinsic part of Article 19(1)(a) and Article 21.

#### (B) Freedom to Assemble - Article 19(1)(b)

Citizens have the right to assemble peaceably and without arms. This includes the right to hold public meetings and processions.

**Restrictions under Article 19(3):**
Reasonable restrictions can be imposed in the interest of public order and sovereignty and integrity of India.

#### (C) Freedom to Form Associations - Article 19(1)(c)

Citizens have the right to form associations, unions, and co-operative societies.

**Restrictions under Article 19(4):**
Reasonable restrictions can be imposed in the interest of public order, morality, health, sovereignty and integrity of India.

#### (D) Freedom of Movement - Article 19(1)(d)

Citizens have the right to move freely throughout the territory of India.

**Restrictions under Article 19(5):**
Reasonable restrictions can be imposed in the interest of the general public or for the protection of the interests of any Scheduled Tribe.

#### (E) Freedom of Residence - Article 19(1)(e)

Citizens have the right to reside and settle in any part of the territory of India.

**Restrictions under Article 19(5):**
Same as Article 19(1)(d).

#### (F) Freedom of Profession - Article 19(1)(g)

Citizens have the right to practice any profession, or to carry on any occupation, trade, or business.

**Restrictions under Article 19(6):**
The State can impose reasonable restrictions in the interest of the general public. The State can also carry on any trade or business to the exclusion of citizens (nationalization).

### 3.2 Article 20 - Protection in Respect of Conviction for Offences

Article 20 provides three protections:

#### (A) Ex Post Facto Law - Article 20(1)

No person shall be convicted of any offence except for violation of a law in force at the time of the commission of the act. No person shall be subjected to a penalty greater than that prescribed by the law in force at the time of the commission of the offence.

This means that a law cannot be applied retrospectively to criminalize an act that was not an offence when committed. However, this protection is available only for criminal laws, not civil or tax laws.

#### (B) Double Jeopardy - Article 20(2)

No person shall be prosecuted and punished for the same offence more than once.

This principle is based on the Latin maxim "nemo debet bis vexari pro una et eadem causa" (no one should be vexed twice for the same cause).

**Key Case:** *Maqbool Hussain v. State of Bombay* (1953) - The Court held that Article 20(2) applies only when there has been both prosecution and punishment. Mere prosecution without punishment does not attract double jeopardy.

#### (C) Self-Incrimination - Article 20(3)

No person accused of any offence shall be compelled to be a witness against himself.

This protection is available only to an accused person. It does not apply to witnesses. The accused cannot be compelled to give evidence against himself.

**Key Cases:**
- *State of Bombay v. Kathi Kalu Oghad* (1961) - The Court held that taking fingerprints, blood samples, and handwriting samples does not violate Article 20(3) because these are not "testimonial compulsion."
- *Selvi v. State of Karnataka* (2010) - The Court held that narco-analysis, polygraph, and brain mapping tests violate Article 20(3) because they involve testimonial compulsion.

### 3.3 Article 21 - Right to Life and Personal Liberty

**Text:** "No person shall be deprived of his life or personal liberty except according to procedure established by law."

Article 21 is the most dynamic and expansive fundamental right. The Supreme Court has given it the widest possible interpretation.

#### Evolution of Article 21

**A.K. Gopalan v. State of Madras (1950):** The Supreme Court took a narrow view, holding that "procedure established by law" means any procedure prescribed by law. The Court rejected the American "due process" doctrine.

**Maneka Gandhi v. Union of India (1978):** This landmark judgment revolutionized the interpretation of Article 21. The Court held that:
1. "Procedure established by law" must be fair, just, and reasonable, not merely prescribed by law.
2. Articles 14, 19, and 21 are interconnected and form a golden triangle.
3. The procedure must not be arbitrary, unfair, or unreasonable.

#### Rights Read into Article 21

The Supreme Court has read numerous rights into Article 21:

1. **Right to Privacy** - *K.S. Puttaswamy v. Union of India* (2017)
2. **Right to Livelihood** - *Olga Tellis v. BMC* (1985)
3. **Right to Clean Environment** - *M.C. Mehta v. Union of India* (various cases)
4. **Right to Health** - *Paschim Banga Khet Mazdoor Samity v. State of West Bengal* (1996)
5. **Right to Education** - *Unnikrishnan v. State of Andhra Pradesh* (1993) - Later became Article 21A
6. **Right to Speedy Trial** - *Hussainara Khatoon v. State of Bihar* (1979)
7. **Right against Torture** - *D.K. Basu v. State of West Bengal* (1997)
8. **Right to Sleep** - *Re: Ramlila Maidan Incident* (2012)
9. **Right to Die with Dignity** - *Common Cause v. Union of India* (2018)
10. **Right to Travel Abroad** - *Maneka Gandhi v. Union of India* (1978)
11. **Right to Legal Aid** - *Hussainara Khatoon v. State of Bihar* (1979)
12. **Right to Shelter** - *Chameli Singh v. State of UP* (1996)
13. **Right to Food** - *People's Union for Civil Liberties v. Union of India* (2001)
14. **Right to Marriage** - *Shafin Jahan v. Asokan K.M.* (2018) - Hadiya case

### 3.4 Article 22 - Protection Against Arrest and Detention

Article 22 provides two sets of protections:

#### (A) Rights of Arrested Persons - Article 22(1) and (2)

1. Right to be informed of the grounds of arrest.
2. Right to consult and be defended by a legal practitioner of one's choice.
3. Right to be produced before a magistrate within 24 hours of arrest (excluding travel time).
4. Right not to be detained beyond 24 hours without the authority of a magistrate.

**Landmark Case:** *D.K. Basu v. State of West Bengal* (1997) - The Supreme Court laid down guidelines for arrest and detention to prevent custodial violence.

#### (B) Preventive Detention - Article 22(4) to (7)

Preventive detention means detention without trial. Article 22 provides safeguards:
1. No person can be detained for more than 3 months without the opinion of an Advisory Board.
2. The detainee must be informed of the grounds of detention.
3. The detainee must be afforded the earliest opportunity to make a representation against the detention.

### 3.5 Previous Year Questions (UP PCS-J)

**2021:** "Article 21 is the heart of Fundamental Rights." Discuss with landmark judgments.

**2020:** Compare the scope of freedom of speech and expression in India and the United States.

**2019:** "The right to life includes the right to die with dignity." Discuss with reference to the Common Cause case.`
      },
      {
        id: "topic-004",
        title: "Directive Principles & Fundamental Duties",
        summary: "DPSP (Part IV) are non-justiciable but fundamental in governance. Classified into Socialistic, Gandhian, and Liberal-Intellectual. Fundamental Duties (Art 51A) added by 42nd Amendment.",
        difficulty: "easy",
        content: `## Chapter 4: Directive Principles of State Policy & Fundamental Duties

### 4.1 Directive Principles of State Policy (Part IV, Articles 36-51)

The Directive Principles of State Policy (DPSP) are contained in Part IV of the Constitution (Articles 36 to 51). They are guidelines for the State to establish social and economic democracy in India.

#### Nature and Characteristics

1. **Non-justiciable:** Article 37 declares that DPSP are not enforceable by any court. However, they are "fundamental in the governance of the country" and it is the duty of the State to apply them in making laws.

2. **Positive obligations:** Unlike Fundamental Rights which are negative (restraining the State), DPSP impose positive obligations on the State to take action.

3. **Instrument of Instructions:** DPSP are akin to the "Instrument of Instructions" issued under the Government of India Act, 1935.

4. ** borrowed from Ireland:** The concept of DPSP was borrowed from the Irish Constitution, which had "Directive Principles of Social Policy."

#### Classification of DPSP

The DPSP can be classified into three categories:

**1. Socialistic Principles (Articles 38-43A):**
- Article 38: State to promote welfare of the people and minimize inequalities.
- Article 39: Certain principles of policy to be followed by the State (equal pay for equal work, protection of workers, etc.).
- Article 39A: Equal justice and free legal aid.
- Article 41: Right to work, education, and public assistance.
- Article 42: Provision for just and humane conditions of work and maternity relief.
- Article 43: Living wage for workers.
- Article 43A: Participation of workers in management of industries.

**2. Gandhian Principles (Articles 40, 43, 46-48):**
- Article 40: Organization of village panchayats.
- Article 43: Promotion of cottage industries.
- Article 46: Promotion of educational and economic interests of SC/ST and weaker sections.
- Article 47: Duty of the State to raise the level of nutrition and standard of living and to improve public health.
- Article 48: Organization of agriculture and animal husbandry; prohibition of slaughter of cows and calves.

**3. Liberal-Intellectual Principles (Articles 44, 45, 48A, 49-51):**
- Article 44: Uniform Civil Code.
- Article 45: Early childhood care and education (amended by 86th Amendment).
- Article 48A: Protection and improvement of environment.
- Article 49: Protection of monuments and places of national importance.
- Article 50: Separation of judiciary from executive.
- Article 51: Promotion of international peace and security.

### 4.2 Relationship Between Fundamental Rights and DPSP

The relationship between Fundamental Rights (Part III) and DPSP (Part IV) has been the subject of judicial interpretation:

**State of Madras v. Champakam Dorairajan (1951):** The Supreme Court held that Fundamental Rights prevail over DPSP in case of conflict. DPSP cannot override Fundamental Rights.

**Golaknath Case (1967):** The Court reaffirmed the supremacy of Fundamental Rights.

**Kesavananda Bharati Case (1973):** The Court held that both FR and DPSP are complementary and supplementary to each other. They form a "conscience" of the Constitution.

**Minerva Mills v. Union of India (1980):** The Court struck down the 42nd Amendment provision that gave primacy to DPSP over Articles 14 and 19. The Court held that harmony between FR and DPSP is part of the basic structure. The Court observed: "The Indian Constitution is founded on the bedrock of the balance between Part III and Part IV."

**Current Position:** Both FR and DPSP are complementary. The State must strive to achieve the goals of DPSP while respecting Fundamental Rights. The courts have increasingly used DPSP to interpret Fundamental Rights expansively.

### 4.3 Implementation of DPSP

Several legislative measures have been taken to implement DPSP:
- Land reforms and abolition of zamindari.
- Minimum Wages Act, 1948.
- Equal Remuneration Act, 1976.
- Legal Services Authorities Act, 1987 (Article 39A).
- 73rd and 74th Amendments (Article 40).
- Right to Education Act, 2009 (Article 45).
- MGNREGA, 2005 (Article 41).
- National Food Security Act, 2013 (Article 47).

### 4.4 Fundamental Duties (Part IVA, Article 51A)

The Fundamental Duties were added by the 42nd Amendment Act, 1976, on the recommendation of the Swaran Singh Committee. Originally, there were 10 duties. The 11th duty was added by the 86th Amendment Act, 2002.

#### List of Fundamental Duties (Article 51A):

It shall be the duty of every citizen of India:
(a) To abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem.
(b) To cherish and follow the noble ideals which inspired our national struggle for freedom.
(c) To uphold and protect the sovereignty, unity, and integrity of India.
(d) To defend the country and render national service when called upon to do so.
(e) To promote harmony and the spirit of common brotherhood amongst all the people of India transcending religious, linguistic, and regional or sectional diversities; to renounce practices derogatory to the dignity of women.
(f) To value and preserve the rich heritage of our composite culture.
(g) To protect and improve the natural environment including forests, lakes, rivers, and wildlife, and to have compassion for living creatures.
(h) To develop the scientific temper, humanism, and the spirit of inquiry and reform.
(i) To safeguard public property and to abjure violence.
(j) To strive towards excellence in all spheres of individual and collective activity so that the nation constantly rises to higher levels of endeavor and achievement.
(k) Who is a parent or guardian, to provide opportunities for education to his child or ward between the age of six and fourteen years. (Added by 86th Amendment, 2002)

#### Characteristics:
1. Applicable only to citizens.
2. Non-justiciable - not enforceable by courts.
3. Can be used for interpretation of ambiguous statutes.
4. Violation may attract legal consequences if there is a specific law.

### 4.5 Previous Year Questions (UP PCS-J)

**2020:** Discuss the relationship between Fundamental Rights and Directive Principles of State Policy.

**2018:** "Fundamental Duties are moral obligations rather than legal obligations." Comment.

**2016:** Critically examine the significance of Directive Principles in achieving social justice in India.`
      },
      {
        id: "topic-005",
        title: "Writ Jurisdiction & Constitutional Remedies (Articles 32 & 226)",
        summary: "Article 32 (SC) and Article 226 (HC) grant writ jurisdiction. Five writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto. Art 226 is wider in scope.",
        difficulty: "hard",
        content: `## Chapter 5: Writ Jurisdiction & Constitutional Remedies

### 5.1 Article 32 - Right to Constitutional Remedies

**Text:** "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed."

Dr. B.R. Ambedkar called Article 32 the "heart and soul of the Constitution." It is itself a Fundamental Right.

#### Scope of Article 32:
1. The Supreme Court has the power to issue directions, orders, or writs for the enforcement of Fundamental Rights.
2. The right to move the Supreme Court under Article 32 cannot be suspended except as provided by the Constitution (during Emergency under Article 359).
3. The Supreme Court cannot refuse to exercise its jurisdiction under Article 32 on the ground of alternative remedy.

**Romesh Thappar v. State of Madras (1950):** The Court held that Article 32 is itself a Fundamental Right and the Supreme Court is the guarantor of Fundamental Rights.

### 5.2 Five Writs

#### (A) Habeas Corpus - "Produce the Body"

**Purpose:** To secure the release of a person who has been unlawfully detained.

**Key Features:**
- Can be filed by the detained person or any person on their behalf.
- The court orders the detaining authority to produce the detained person before the court.
- If the detention is found to be unlawful, the court orders immediate release.
- Can be issued against both State and private individuals.

**ADM Jabalpur v. Shivkant Shukla (1976):** During the Emergency, the Supreme Court (by 4:1 majority) held that the right to move the court under Article 32 for enforcement of Article 21 was suspended. Justice H.R. Khanna dissented, holding that the right to life and liberty cannot be taken away even during Emergency. This judgment was later overruled by the Supreme Court in *Justice K.S. Puttaswamy v. Union of India* (2017).

#### (B) Mandamus - "We Command"

**Purpose:** To command a public authority to perform a public duty that it has failed or refused to perform.

**Key Features:**
- Cannot be issued against a private individual (unless they are performing a public duty).
- Cannot be issued against the President or Governor.
- Cannot be issued to enforce a contractual obligation.
- Can be issued in favor of a Fundamental Right.

#### (C) Prohibition

**Purpose:** To forbid a lower court or tribunal from continuing proceedings in excess of its jurisdiction.

**Key Features:**
- Issued during the pendency of proceedings.
- Issued only to judicial and quasi-judicial bodies.
- Prevents usurpation of jurisdiction.

#### (D) Certiorari - "To be Certified"

**Purpose:** To quash an order passed by a lower court or tribunal.

**Key Features:**
- Issued after the order has been passed.
- Issued on grounds of: (a) lack of jurisdiction, (b) excess of jurisdiction, (c) violation of natural justice, (d) error of law apparent on the face of the record.
- Issued only to judicial and quasi-judicial bodies.

**Difference between Prohibition and Certiorari:**
- Prohibition is issued during proceedings; Certiorari is issued after the order.
- Both are issued to judicial and quasi-judicial bodies.

#### (E) Quo Warranto - "By What Authority"

**Purpose:** To inquire into the legality of a claim to a public office.

**Key Features:**
- Prevents unlawful usurpation of public office.
- Can be filed by any person (not necessarily the person aggrieved).
- The court can remove a person from an office to which they are not entitled.

### 5.3 Article 226 - High Court Writ Jurisdiction

Article 226 empowers the High Courts to issue writs for the enforcement of Fundamental Rights AND "for any other purpose."

#### Comparison: Article 32 vs Article 226

| Feature | Article 32 (SC) | Article 226 (HC) |
|---------|----------------|-----------------|
| Scope | Only for Fundamental Rights | For FRs and "any other purpose" |
| Nature | Itself a Fundamental Right | Discretionary remedy |
| Territory | Throughout India | Within territorial jurisdiction |
| Alternative remedy | Cannot refuse on this ground | Can refuse if alternative remedy exists |
| Power | Cannot be suspended except under Article 359 | Wider discretionary power |

**L. Chandra Kumar v. Union of India (1997):** The Supreme Court held that the power of judicial review under Articles 32 and 226 is part of the basic structure of the Constitution and cannot be taken away.

### 5.4 Public Interest Litigation (PIL)

PIL is a judicial innovation that allows any public-spirited person to approach the court on behalf of those whose rights are violated. It relaxes the rule of locus standi.

**Key Cases:**
- *S.P. Gupta v. Union of India* (1981) - First PIL case.
- *Bandhua Mukti Morcha v. Union of India* (1984) - Bonded laborers.
- *Vishaka v. State of Rajasthan* (1997) - Sexual harassment at workplace.
- *M.C. Mehta v. Union of India* (various) - Environmental PILs.

### 5.5 Previous Year Questions (UP PCS-J)

**2019:** Compare the writ jurisdiction of Supreme Court under Article 32 and High Courts under Article 226.

**2017:** "Public Interest Litigation has democratized access to justice." Discuss.

**2015:** Explain the five writs with illustrations.`
      }
    ]
  },
  "Civil Procedure": {
    bookId: "book-002",
    chapters: [
      {
        id: "topic-006",
        title: "Jurisdiction of Civil Courts & Res Judicata",
        summary: "Section 9 CPC grants civil courts jurisdiction over all civil suits except expressly/impliedly barred. Section 11 embodies res judicata - matter finally decided cannot be re-litigated.",
        difficulty: "hard",
        content: `## Chapter 1: Jurisdiction of Civil Courts & Res Judicata

### 1.1 Section 9 - Jurisdiction of Civil Courts

**Text:** "The Courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred."

Section 9 is the foundation of civil jurisdiction. It establishes a presumption in favor of jurisdiction - civil courts have jurisdiction over all civil suits unless specifically excluded.

#### Meaning of "Suit of Civil Nature"

A suit of civil nature is one in which the principal question relates to the determination of a civil right. It includes:
- Disputes relating to property
- Disputes relating to contract
- Disputes relating to trust
- Disputes relating to office
- Disputes relating to marriage (in some cases)

It does NOT include:
- Criminal matters
- Matters of purely religious character (unless civil rights are involved)
- Political questions

#### Express Bar

An express bar is when a statute explicitly ousts the jurisdiction of civil courts. For example, Section 95 of the Specific Relief Act bars civil courts from entertaining suits for compensation for breach of contract where the contract is specifically enforceable.

#### Implied Bar

An implied bar arises when a statute creates a special right and provides a special remedy, thereby impliedly excluding the jurisdiction of civil courts. The principle is: "Where a statute creates a right and provides a special remedy, that remedy must be followed."

**Key Case:** *Dhulabhai v. State of MP* (1968) - The Supreme Court laid down principles for determining when civil court jurisdiction is impliedly barred.

#### Burden of Proof

The burden of proving that civil court jurisdiction is barred lies on the party asserting the bar. The presumption is always in favor of jurisdiction.

### 1.2 Res Judicata - Section 11 CPC

**Text:** "No Court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, or between parties under whom they or any of them claim, litigating under the same title, in a Court competent to try such subsequent suit or to hear and decide such subsequent issue, and has been heard and finally decided by such Court."

#### Maxim
"Nemo debet bis vexari pro una et eadem causa" - No one should be vexed twice for the same cause.

#### Object of Res Judicata
1. To prevent multiplicity of proceedings.
2. To bring finality to litigation.
3. To protect parties from harassment.
4. To promote judicial efficiency.

#### Essential Conditions

For res judicata to apply, the following conditions must be satisfied:

**1. Matter Directly and Substantially in Issue:**
The matter must have been directly and substantially in issue in the former suit. A matter is directly and substantially in issue when it is alleged by one party and denied or admitted by the other.

**2. Same Parties:**
The former suit must have been between the same parties or between parties under whom they or any of them claim. Parties litigating in different capacities cannot claim res judicata.

**3. Same Title:**
The parties must have litigated under the same title in the former suit.

**4. Competent Court:**
The court which decided the former suit must have been competent to try the subsequent suit or issue.

**5. Heard and Finally Decided:**
The matter must have been heard and finally decided. A decision on merits is required. Dismissal for default or technical grounds does not operate as res judicata.

#### Constructive Res Judicata (Explanation IV)

Explanation IV to Section 11 provides that any matter which might and ought to have been made a ground of attack or defense in the former suit shall be deemed to have been constructively in issue. This prevents parties from withholding grounds and raising them in subsequent proceedings.

**Key Case:** *Workmen of Cochin Port Trust v. Board of Trustees* (1978) - The Supreme Court explained constructive res judicata.

#### Res Judicata vs Res Sub Judice

| Feature | Res Judicata (Section 11) | Res Sub Judice (Section 10) |
|---------|--------------------------|---------------------------|
| Stage | Matter already decided | Matter pending |
| Effect | Bars trial | Stays trial |
| Purpose | Prevents re-litigation | Prevents conflicting judgments |
| Application | After final decision | During pendency |

#### Application to Writ Petitions

**Daryao v. State of UP (1961):** The Supreme Court held that res judicata applies to writ petitions under Articles 32 and 226. If a writ petition is dismissed on merits, a subsequent petition on the same grounds is barred.

**Devilal Modi v. STO* (1965):** The Court held that the principle of res judicata applies to tax proceedings as well.

### 1.3 Previous Year Questions (UP PCS-J)

**2023:** Explain the doctrine of res judicata under Section 11 CPC with its essential conditions.

**2021:** Distinguish between res judicata and res sub judice.

**2019:** "Constructive res judicata is based on public policy." Discuss.`
      },
      {
        id: "topic-007",
        title: "Pleadings - Plaint and Written Statement",
        summary: "Pleadings (Order VI) must state material facts, not evidence. Plaint (Order VII) initiates suit. Written Statement (Order VIII) is defence. Order VII Rule 11 provides for rejection of plaint.",
        difficulty: "medium",
        content: `## Chapter 2: Pleadings - Plaint and Written Statement

### 2.1 Order VI - Pleadings

**Definition:** "Pleadings" means plaint or written statement (Order VI, Rule 1).

#### Purpose of Pleadings
1. To ascertain the real questions in dispute between the parties.
2. To narrow down the issues.
3. To give notice to the opposite party of the case they have to meet.
4. To determine the burden of proof.

#### Fundamental Rules of Pleadings (Order VI, Rule 2)

1. **Material Facts Only:** Every pleading must contain a statement in a concise form of the material facts on which the party pleading relies. It should NOT contain evidence.

2. **Facts, Not Law:** Pleadings should state facts, not law.

3. **Concise Form:** Pleadings must be concise.

4. **Paragraphs:** Pleadings must be divided into paragraphs, numbered consecutively.

5. **Dates, Sums, Numbers:** Must be expressed in figures.

#### Material Facts vs Particulars

- **Material Facts:** The primary facts that constitute the cause of action or defense. These must be pleaded.
- **Particulars:** The details of the material facts. These may be furnished if the court orders.

**Key Case:** *Kishan Das v. Nathu Ram* (1990) - The Supreme Court distinguished between material facts and evidence.

### 2.2 Order VII - Plaint

#### Contents of Plaint (Order VII, Rule 1)

The plaint must contain:
1. Name of the court.
2. Name, description, and place of residence of the plaintiff and defendant.
3. Facts constituting the cause of action and when it arose.
4. Facts showing that the court has jurisdiction.
5. Relief claimed (specifically and precisely).
6. Valuation of the suit for jurisdiction and court fees.
7. Verification (Order VI, Rule 15).

#### Rejection of Plaint (Order VII, Rule 11)

A plaint can be rejected on the following grounds:
(a) It does not disclose a cause of action.
(b) The relief claimed is undervalued and the plaintiff fails to correct it within the time fixed by the court.
(c) The plaint is insufficiently stamped and the plaintiff fails to pay the deficit court fees.
(d) The suit appears to be barred by any law.

**Key Cases:**
- *T. Arivandandam v. T.V. Satyapal* (1977) - The Court must examine the plaint to see if it discloses a cause of action.
- *Saleem Bhai v. State of Maharashtra* (2003) - The court can look into the documents filed with the plaint to determine if the suit is barred by law.

#### Return of Plaint (Order VII, Rule 10)

The plaint can be returned for presentation to the proper court if the court finds that it does not have jurisdiction.

### 2.3 Order VIII - Written Statement

#### Contents of Written Statement

The defendant must specifically deny each allegation of fact. An evasive denial amounts to an admission.

**Specific Denial:** The defendant must deal with each allegation of fact specifically. If a fact is not denied specifically, it is deemed to be admitted (Order VIII, Rule 5).

**Set-off:** The defendant can claim set-off if there is a mutual debt between the plaintiff and defendant (Order VIII, Rule 6).

**Counter-claim:** The defendant can file a counter-claim against the plaintiff (Order VIII, Rule 6A). A counter-claim is treated as a cross-suit.

#### Amendment of Pleadings (Order VI, Rule 17)

The court may allow amendment of pleadings at any stage of the proceedings for the purpose of determining the real questions in controversy.

**Key Principles:**
1. Amendment should not alter the nature of the suit.
2. Amendment should not cause prejudice to the other party.
3. Amendment should not introduce a time-barred claim.
4. After the trial has begun, amendment can be allowed only if the party could not have discovered the matter with due diligence.

**Key Case:** *Rajesh Kumar Aggarwal v. K.K. Mohindroo* (2017) - The Supreme Court laid down principles for allowing amendment of pleadings.

### 2.4 Previous Year Questions (UP PCS-J)

**2022:** When can a plaint be rejected under Order VII Rule 11 CPC? Discuss with case law.

**2020:** "Pleadings must state material facts, not evidence." Explain with illustrations.

**2018:** Distinguish between set-off and counter-claim.`
      },
      {
        id: "topic-008",
        title: "Interim Orders - Injunctions & Temporary Relief",
        summary: "Order 39 CPC provides for temporary injunctions. Three tests: prima facie case, balance of convenience, irreparable injury. Ex parte injunctions must be decided within 30 days.",
        difficulty: "medium",
        content: `## Chapter 3: Interim Orders - Injunctions & Temporary Relief

### 3.1 Order 39 Rules 1-2 - Temporary Injunctions

Temporary injunctions are interim orders passed by the court to preserve the subject matter of the suit during the pendency of the proceedings.

#### Grounds for Granting Temporary Injunction (Order 39, Rules 1 & 2)

1. **Rule 1:** Where the defendant is about to dispose of the property in suit or otherwise deal with it in a manner that may defeat the purpose of the suit.

2. **Rule 2:** To restrain the defendant from committing a breach of contract or other injury of any kind.

#### Three Tests for Granting Injunction

The court applies the following three tests (adopted from *American Cyanamid Co. v. Ethicon Ltd.*):

1. **Prima Facie Case:** The plaintiff must show that there is a serious question to be tried and that the plaintiff has a reasonable chance of success.

2. **Balance of Convenience:** The court must weigh the inconvenience that would be caused to the plaintiff if the injunction is refused against the inconvenience that would be caused to the defendant if the injunction is granted.

3. **Irreparable Injury:** The plaintiff must show that they would suffer irreparable injury (injury that cannot be compensated in money) if the injunction is not granted.

**Key Case:** *Dalpat Kumar v. Prahlad Singh* (1993) - The Supreme Court explained the three tests for granting temporary injunction.

### 3.2 Ex Parte Injunction (Order 39, Rule 3)

Normally, an injunction should not be granted without notice to the opposite party. However, in cases of urgency, the court may grant an ex parte injunction if it records reasons for doing so.

**2018 Amendment:** An ex parte injunction must be decided within 30 days. If not decided within 30 days, the injunction stands vacated.

### 3.3 Discharge, Variation, or Setting Aside of Injunction (Order 39, Rule 4)

Any party can apply to the court to discharge, vary, or set aside an injunction order. The court may do so if it is satisfied that there has been a change in circumstances or that the order was passed without sufficient material.

### 3.4 Disobedience of Injunction (Order 39, Rule 2A)

Disobedience of an injunction order is punishable with:
- Attachment of property.
- Detention in civil prison for up to three months.

### 3.5 Previous Year Questions (UP PCS-J)

**2021:** What are the conditions for granting temporary injunction under Order 39 CPC?

**2019:** "Balance of convenience is the most important factor in granting injunction." Discuss.`
      },
      {
        id: "topic-009",
        title: "Appeals, Revisions & Reviews",
        summary: "Section 96: First appeal on law and fact. Section 100: Second appeal only on substantial question of law. Section 114: Review by same judge. Section 115: Revision by High Court.",
        difficulty: "hard",
        content: `## Chapter 4: Appeals, Revisions & Reviews

### 4.1 First Appeal - Section 96

An appeal lies from every decree passed by any court exercising original jurisdiction to the authorized appellate court.

#### Scope:
- Both questions of law and fact can be raised.
- The appellate court can re-appreciate evidence.
- The appellate court has the power to reverse, vary, or affirm the decree.

**Key Case:** *Ganga Bai v. Ganesh Ram* (1881) - The right of appeal is a substantive right vested by statute.

### 4.2 Second Appeal - Section 100

A second appeal lies to the High Court from a decree passed in first appeal by a subordinate court, but ONLY on a substantial question of law.

#### Substantial Question of Law:
A question of law is substantial if it is of general public importance or if it directly and substantially affects the rights of the parties.

**Key Case:** *Sir Chunilal v. Mehta & Sons* (1962) - The Supreme Court laid down the test for determining whether a question of law is substantial.

**2002 Amendment:** The High Court must formulate the substantial question of law at the time of admission of the appeal. The appeal cannot be entertained unless the court is satisfied that it involves a substantial question of law.

### 4.3 Review - Section 114 + Order 47

Review is a rehearing by the same court and the same judge.

#### Grounds for Review:
1. Discovery of new and important evidence.
2. Error apparent on the face of the record.
3. Sufficient reason (other grounds).

#### Limitation:
Review must be filed within 30 days from the date of the decree or order.

**Key Case:** *Chajju Ram v. Neki* (1922) - Review is not an appeal in disguise. It is limited to the grounds specified in Order 47.

### 4.4 Revision - Section 115

The High Court may call for the record of any case decided by any subordinate court where:
(a) No appeal lies against the order.
(b) The subordinate court has exercised a jurisdiction not vested in it by law, or
(c) The subordinate court has failed to exercise a jurisdiction so vested, or
(d) The subordinate court has acted in the exercise of its jurisdiction illegally or with material irregularity.

**2002 Amendment:** Revision is restricted to cases where the order, if decided in favor of the applicant, would finally dispose of the suit or proceedings.

### 4.5 Previous Year Questions (UP PCS-J)

**2020:** Distinguish between review and revision under CPC with reference to their scope and limitations.

**2018:** "Second appeal lies only on a substantial question of law." Explain with case law.`
      },
      {
        id: "topic-010",
        title: "Execution of Decrees & Orders",
        summary: "Execution of decrees under Sections 51-74 and Order 21 CPC. Modes include delivery of property, attachment and sale, arrest, and receivership. Section 60 lists exempt properties.",
        difficulty: "medium",
        content: `## Chapter 5: Execution of Decrees & Orders

### 5.1 Decree - Section 2(2)

**Definition:** "Decree" means the formal expression of an adjudication which, so far as regards the court expressing it, conclusively determines the rights of the parties with regard to all or any of the matters in controversy in the suit.

#### Types of Decree:
1. **Preliminary Decree:** Declares the rights of the parties but does not completely dispose of the suit.
2. **Final Decree:** Completely disposes of the suit.
3. **Partly Preliminary and Partly Final:** Partly determines rights and partly disposes of the suit.

### 5.2 Modes of Execution - Section 51

The court can execute a decree by:
(a) Delivery of property.
(b) Attachment and sale of property.
(c) Arrest and detention of the judgment-debtor in civil prison.
(d) Appointment of a receiver.
(e) Any other manner appropriate to the nature of the relief granted.

### 5.3 Property Liable to Attachment - Section 60

All saleable property belonging to the judgment-debtor is liable to attachment and sale, EXCEPT the following:
1. Wearing apparel, cooking utensils, and beds.
2. Tools of artisans.
3. Books of account.
4. Agricultural implements.
5. Wages and salary (to a limited extent).
6. Pension and gratuity.
7. Insurance policy proceeds.
8. Right to future maintenance.

### 5.4 Order 21 - Procedure for Execution

**Application for Execution (Order 21, Rule 11):** The decree-holder must file an application for execution containing:
- Number of the suit.
- Names of the parties.
- Date of the decree.
- Relief granted.
- Amount due.
- Mode of execution sought.

### 5.5 Previous Year Questions (UP PCS-J)

**2019:** What properties are exempt from attachment and sale in execution of a decree under Section 60 CPC?

**2017:** Explain the various modes of execution of a decree under Section 51 CPC.`
      }
    ]
  },
  "Contract Law": {
    bookId: "book-005",
    chapters: [
      {
        id: "topic-021",
        title: "Formation of Contract - Offer & Acceptance",
        summary: "Offer (Section 2(a)) must be communicated and definite. Acceptance (Section 2(b)) must be absolute, communicated, and in prescribed mode. Postal rule applies to acceptance by post.",
        difficulty: "easy",
        content: `## Chapter 1: Formation of Contract - Offer & Acceptance

### 1.1 Introduction to the Indian Contract Act, 1872

The Indian Contract Act, 1872, is the primary legislation governing contractual relationships in India. It came into force on September 1, 1872. The Act is based on the English common law of contract but has been modified to suit Indian conditions.

#### Scope of the Act:
- The Act deals with the general principles of contract law (Sections 1-75).
- It also deals with specific contracts: indemnity and guarantee (Sections 124-147), bailment and pledge (Sections 148-181), and agency (Sections 182-238).
- The Act was amended in 1897 to include provisions on partnership (later replaced by the Partnership Act, 1932).

### 1.2 Essential Elements of a Valid Contract (Section 10)

**Section 10:** "All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void."

The essential elements of a valid contract are:
1. Offer and acceptance.
2. Intention to create legal relations.
3. Lawful consideration.
4. Capacity of parties.
5. Free consent.
6. Lawful object.
7. Certainty of terms.
8. Possibility of performance.
9. Not expressly declared void.
10. Compliance with legal formalities.

### 1.3 Offer/Proposal - Section 2(a)

**Definition:** "When one person signifies to another his willingness to do or to abstain from doing anything, with a view to obtaining the assent of that other to such act or abstinence, he is said to make a proposal."

#### Essential Elements of a Valid Offer:
1. **Intention to Create Legal Relations:** The offer must be made with the intention of creating legal relations. Social and domestic agreements are presumed not to create legal relations (*Balfour v. Balfour*, 1919).

2. **Definite and Certain:** The terms of the offer must be clear and certain. A vague offer cannot result in a valid contract.

3. **Communication:** The offer must be communicated to the offeree. An offer cannot be accepted without knowledge of it (*Lalman Shukla v. Gauri Dutt*, 1913).

4. **Distinction from Invitation to Offer:** An invitation to offer is not an offer but an invitation to receive offers. Examples: display of goods in a shop, advertisements, auction notices, tender notices.

**Key Cases:**
- *Carlill v. Carbolic Smoke Ball Co.* (1893) - An advertisement offering a reward was held to be a general offer, not a mere invitation to offer. The company had deposited money in a bank to show sincerity.
- *Harvey v. Facey* (1893) - A telegram stating the lowest price was held to be a mere supply of information, not an offer.
- *Pharmaceutical Society of Great Britain v. Boots Cash Chemists* (1953) - Display of goods on shelves is an invitation to offer, not an offer. The offer is made by the customer at the cash counter.

#### Kinds of Offer:
1. **Specific Offer:** Made to a particular person or group of persons.
2. **General Offer:** Made to the world at large. Can be accepted by any person who fulfills the conditions (*Carlill v. Carbolic Smoke Ball Co.*).
3. **Express Offer:** Made in words (oral or written).
4. **Implied Offer:** Made by conduct or circumstances.
5. **Cross Offers:** When two parties make identical offers to each other without knowledge of each other's offer. Cross offers do not result in a contract.
6. **Counter Offer:** When the offeree modifies the terms of the original offer. A counter offer destroys the original offer (*Hyde v. Wrench*, 1840).

### 1.4 Acceptance - Section 2(b)

**Definition:** "When the person to whom the proposal is made signifies his assent thereto, the proposal is said to be accepted."

#### Rules of Valid Acceptance:
1. **Absolute and Unqualified:** Acceptance must be absolute and unqualified. A qualified acceptance is a counter offer (*Hyde v. Wrench*, 1840).

2. **Communicated:** Acceptance must be communicated to the offeror. Mental acceptance is not sufficient (*Brogden v. Metropolitan Railway Co.*, 1877).

3. **In Prescribed Mode:** If the offer prescribes a mode of acceptance, it must be accepted in that mode. If no mode is prescribed, it must be accepted in a reasonable manner.

4. **By Person to Whom Offer is Made:** Only the person to whom the offer is made can accept it. A stranger cannot accept an offer.

5. **Within Reasonable Time:** Acceptance must be given within the time specified in the offer or within a reasonable time.

6. **Cannot Precede Offer:** Acceptance cannot precede the offer. There must be a "meeting of minds" (consensus ad idem).

**Key Cases:**
- *Felthouse v. Bindley* (1862) - Silence cannot be construed as acceptance. The offeror cannot impose acceptance by stating that silence will be deemed acceptance.
- *Brogden v. Metropolitan Railway Co.* (1877) - Acceptance must be communicated.
- *Powell v. Lee* (1908) - Acceptance must be communicated by the offeree or their authorized agent.

### 1.5 Communication of Offer and Acceptance - Sections 3-5

#### Communication of Offer:
An offer is complete when it comes to the knowledge of the offeree.

#### Communication of Acceptance:
- **Against the Proposer:** When the acceptance is put in a course of transmission (postal rule). The acceptance is complete against the proposer as soon as it is posted (*Adams v. Lindsell*, 1818).
- **Against the Acceptor:** When the acceptance comes to the knowledge of the proposer.

#### Revocation:
- **Revocation of Offer:** Can be revoked at any time before the acceptance is complete against the proposer.
- **Revocation of Acceptance:** Can be revoked at any time before the acceptance letter reaches the proposer.

**Key Case:** *Bhagwandas Goverdhandas Kedia v. Girdharilal Parshottamdas & Co.* (1966) - In telephonic communication, acceptance is complete when the offeror hears the acceptance.

### 1.6 Previous Year Questions (UP PCS-J)

**2022:** Explain the rules of valid acceptance. When is communication of acceptance complete?

**2020:** Distinguish between offer and invitation to offer with case law.

**2018:** "A counter offer destroys the original offer." Discuss with illustrations.`
      },
      {
        id: "topic-022",
        title: "Consideration & Privity of Contract",
        summary: "Consideration (Section 2(d)) is quid pro quo. May move from any person. Section 25 exceptions: love/affection, past service, time-barred debt, gift, agency, bailment. Privity rule with exceptions.",
        difficulty: "medium",
        content: `## Chapter 2: Consideration & Privity of Contract

### 2.1 Consideration - Section 2(d)

**Definition:** "When, at the desire of the promisor, the promisee or any other person has done or abstained from doing, or does or abstains from doing, or promises to do or to abstain from doing, something, such act or abstinence or promise is called a consideration for the promise."

#### Essential Elements of Consideration:
1. **At the Desire of the Promisor:** The act or abstinence must be at the desire of the promisor. An act done voluntarily without the promisor's desire is not consideration (*Durga Prasad v. Baldeo*, 1880).

2. **May Move from Promisee or Any Other Person:** Unlike English law, Indian law allows consideration to move from any person, not just the promisee (*Chinnaya v. Ramaya*, 1882).

3. **May Be Past, Present, or Future:**
   - Past consideration: Something already done before the promise is made.
   - Present (executed) consideration: Something done at the time of the promise.
   - Future (executory) consideration: Something to be done in the future.

4. **Need Not Be Adequate:** Consideration need not be adequate but must be real. Courts do not inquire into the adequacy of consideration (Explanation 2 to Section 25).

5. **Must Be Real:** Consideration must be real and not illusory. It must have some value in the eyes of the law.

6. **Must Be Lawful:** Consideration must not be forbidden by law, fraudulent, or immoral (Section 23).

**Key Cases:**
- *Chinnaya v. Ramaya* (1882) - Consideration can move from a third party. An aunt transferred property to her niece with the condition that the niece pay an annuity to the aunt's sister. The sister could enforce the promise.
- *Kedarnath v. Gorie Mohamed* (1886) - A promise to subscribe to a public charity is enforceable if the promisee has incurred liability on the faith of the promise.
- *Abdul Aziz v. Masum Ali* (1914) - A promise to contribute to a charity without any consideration is not enforceable.

### 2.2 Exceptions to "No Consideration, No Contract" - Section 25

As a general rule, an agreement without consideration is void. However, Section 25 provides the following exceptions:

1. **Natural Love and Affection (Section 25(1)):** An agreement made without consideration is valid if it is:
   - Expressed in writing.
   - Registered.
   - Made on account of natural love and affection.
   - Between parties standing in a near relation to each other.

2. **Compensation for Past Voluntary Service (Section 25(2)):** A promise to compensate, wholly or in part, a person who has already voluntarily done something for the promisor is valid.

3. **Promise to Pay Time-Barred Debt (Section 25(3)):** A promise to pay a debt that is barred by the law of limitation is valid if it is in writing and signed by the promisor.

4. **Completed Gift (Explanation 1):** The rule "no consideration, no contract" does not affect the validity of a completed gift.

5. **Agency (Section 185):** No consideration is necessary to create an agency.

6. **Gratuitous Bailment (Section 148):** No consideration is necessary for a gratuitous bailment.

### 2.3 Privity of Contract

**General Rule:** Only parties to a contract can sue or be sued. A stranger to a contract cannot enforce it.

**Exceptions:**
1. **Trust or Charge:** A beneficiary under a trust can enforce it.
2. **Marriage Settlement:** A member of the family can enforce a marriage settlement.
3. **Family Arrangement:** A member of the family can enforce a family arrangement.
4. **Acknowledgement or Estoppel:** If the promisor acknowledges liability to a third party, the third party can sue.
5. **Covenants Running with Land:** A purchaser of land is bound by covenants running with the land.
6. **Contracts through Agents:** The principal can enforce contracts made by the agent.

**Key Cases:**
- *Dunlop v. Selfridge* (1915) - The House of Lords held that only parties to a contract can sue. A third party cannot enforce a contract even if it is made for their benefit.
- *M.C. Chacko v. State Bank of Travancore* (1970) - The Supreme Court affirmed the privity rule in India.
- *Khawaja Muhammad Khan v. Hussaini Begum* (1910) - An exception to the privity rule was recognized where a contract is made for the benefit of a third party who is a member of the family.

### 2.4 Previous Year Questions (UP PCS-J)

**2021:** "Consideration need not be adequate but must be real." Explain with exceptions under Section 25.

**2019:** Discuss the doctrine of privity of contract with its exceptions.

**2017:** "Consideration may move from any person." Explain with case law.`
      },
      {
        id: "topic-023",
        title: "Free Consent - Coercion, Fraud & Misrepresentation",
        summary: "Free consent requires absence of coercion, undue influence, fraud, misrepresentation, and mistake. Coercion is criminal; undue influence is equitable. Fraud is intentional; misrepresentation is innocent.",
        difficulty: "medium",
        content: `## Chapter 3: Free Consent - Coercion, Fraud & Misrepresentation

### 3.1 Free Consent - Section 14

**Section 14:** Consent is said to be free when it is not caused by:
1. Coercion (Section 15).
2. Undue influence (Section 16).
3. Fraud (Section 17).
4. Misrepresentation (Section 18).
5. Mistake (Sections 20-22).

If consent is not free, the contract is voidable at the option of the party whose consent was not free.

### 3.2 Coercion - Section 15

**Definition:** "Coercion" is the committing, or threatening to commit, any act forbidden by the Indian Penal Code, or the unlawful detaining, or threatening to detain, any property, to the prejudice of any person whatever, with the intention of causing any person to enter into an agreement.

#### Key Features:
1. Can be committed by any person (not necessarily a party to the contract).
2. Can be directed against any person (not necessarily the other party).
3. Includes threat to commit an act forbidden by the IPC.
4. Includes unlawful detention of property.

**Key Cases:**
- *Chikkam Ammiraju v. Chikkam Seshamma* (1917) - A threat to commit suicide amounts to coercion. The Madras High Court held that suicide is forbidden by the IPC (attempt to commit suicide was an offence under Section 309 IPC).
- *Muthia v. Karuppan* (1927) - A threat to prosecute a person for an offence amounts to coercion.

### 3.3 Undue Influence - Section 16

**Definition:** A contract is said to be induced by undue influence where:
1. The relations between the parties are such that one party is in a position to dominate the will of the other.
2. The dominant party uses that position to obtain an unfair advantage.

#### Presumption of Undue Influence:
Undue influence is presumed in the following relationships:
- Parent and child.
- Guardian and ward.
- Trustee and beneficiary.
- Spiritual guru and disciple.
- Doctor and patient.
- Solicitor and client.

**Key Cases:**
- *Lloyds Bank v. Bundy* (1974) - The English Court of Appeal held that undue influence arises where there is a relationship of trust and confidence.
- *Mannu Singh v. Umadat Prasad* (1890) - A spiritual guru who induced his disciple to execute a deed in his favor was held to have exercised undue influence.

### 3.4 Fraud - Section 17

**Definition:** "Fraud" means and includes any of the following acts committed by a party to a contract, or with his connivance, or by his agent, with intent to deceive another party thereto or his agent, or to induce him to enter into the contract:
1. The suggestion, as a fact, of that which is not true, by one who does not believe it to be true.
2. The active concealment of a fact by one having knowledge or belief of the fact.
3. A promise made without any intention of performing it.
4. Any other act fitted to deceive.
5. Any such act or omission as the law specially declares to be fraudulent.

#### Key Features:
1. Must be committed by a party to the contract (or with their connivance).
2. Must be committed with intent to deceive.
3. Silence is not fraud unless there is a duty to speak.

**Key Cases:**
- *Derry v. Peek* (1889) - The House of Lords held that fraud requires proof of dishonesty. A false statement made honestly is not fraud.
- *Shri Krishan v. Kurukshetra University* (1976) - The Supreme Court held that mere silence is not fraud unless there is a duty to disclose.

### 3.5 Misrepresentation - Section 18

**Definition:** "Misrepresentation" means and includes:
1. The positive assertion, in a manner not warranted by the information of the person making it, of that which is not true, though he believes it to be true.
2. Any breach of duty which, without an intent to deceive, gains an advantage to the person committing it by misleading another to his prejudice.
3. Causing, however innocently, a party to an agreement to make a mistake as to the substance of the thing which is the subject of the agreement.

#### Difference Between Fraud and Misrepresentation:

| Feature | Fraud | Misrepresentation |
|---------|-------|-------------------|
| Intent | Intentional deception | Innocent false statement |
| Knowledge | Maker knows it is false | Maker believes it to be true |
| Remedy | Voidable + damages | Voidable only |
| Defense | Cannot be defended by "reasonable means" | Can be defended by "reasonable means" |

### 3.6 Mistake - Sections 20-22

**Section 20:** Where both parties to an agreement are under a mistake as to a matter of fact essential to the agreement, the agreement is void.

**Section 21:** Mistake as to law in force in India does not make an agreement void.

**Section 22:** A contract is not voidable because it was caused by a mistake of one party as to a matter of fact.

**Key Cases:**
- *Cundy v. Lindsay* (1878) - Mistake as to identity of the party makes the contract void.
- *Bisset v. Wilkinson* (1927) - A statement of opinion is not a misrepresentation.

### 3.7 Previous Year Questions (UP PCS-J)

**2020:** Distinguish between fraud and misrepresentation. What are the effects on contract validity?

**2018:** "Coercion and undue influence are similar but distinct." Discuss.

**2016:** Explain the law relating to mistake of fact and mistake of law.`
      },
      {
        id: "topic-024",
        title: "Void & Voidable Agreements",
        summary: "Void agreements: unlawful object, restraint of marriage/trade/legal proceedings, uncertain, wagering. Voidable: consent vitiated. Quasi-contracts (Sections 68-72) based on equity, not agreement.",
        difficulty: "hard",
        content: `## Chapter 4: Void & Voidable Agreements

### 4.1 Void Agreements

A void agreement is one that is not enforceable by law. It is void ab initio (from the beginning).

#### Agreements Expressly Declared Void (Sections 24-30):

**1. Agreement with Unlawful Object or Consideration (Section 23):**
An agreement is void if the consideration or object is:
- Forbidden by law.
- Would defeat the provisions of any law.
- Is fraudulent.
- Involves injury to the person or property of another.
- Is immoral or opposed to public policy.

**2. Agreement in Restraint of Marriage (Section 26):**
Every agreement in restraint of the marriage of any person (other than a minor) is void.

**3. Agreement in Restraint of Trade (Section 27):**
Every agreement by which any one is restrained from exercising a lawful profession, trade, or business of any kind is void.

**Exception:** Sale of goodwill - The buyer can restrain the seller from carrying on a similar business within reasonable limits.

**Key Cases:**
- *Madhub Chander v. Raj Coomar* (1874) - Restraint of trade is void.
- *Gujarat Bottling Co. v. Coca Cola Co.* (1995) - The Supreme Court upheld a restraint clause in a franchise agreement as reasonable.

**4. Agreement in Restraint of Legal Proceedings (Section 28):**
An agreement that absolutely restricts a party from enforcing their rights under a contract through legal proceedings is void.

**5. Uncertain Agreement (Section 29):**
An agreement, the meaning of which is not certain or capable of being made certain, is void.

**6. Wagering Agreement (Section 30):**
An agreement by way of wager is void. A wager is a promise to give money or money's worth on the determination of an uncertain event.

**Key Case:** *Gherulal Parakh v. Mahadeodas Maiya* (1959) - The Supreme Court held that wagering agreements are void but not illegal. Collateral transactions are valid.

### 4.2 Voidable Agreements

A voidable agreement is one that is enforceable at the option of one party but not at the option of the other. It is valid until avoided.

A contract is voidable when consent is obtained by:
- Coercion.
- Undue influence.
- Fraud.
- Misrepresentation.

### 4.3 Contingent Contracts (Sections 31-36)

**Definition:** A contingent contract is a contract to do or not to do something if some event, collateral to the contract, happens or does not happen.

**Key Features:**
1. The event must be collateral to the contract.
2. The event must be uncertain.
3. The event must not be at the discretion of the promisor.

**Enforcement:**
- If the event happens: The contract becomes enforceable.
- If the event does not happen within a fixed time: The contract becomes void.
- If the event is impossible: The contract is void.

### 4.4 Quasi-Contracts (Sections 68-72)

Quasi-contracts are not true contracts. They are obligations imposed by law to prevent unjust enrichment.

**Section 68:** Claim for necessaries supplied to a person incapable of contracting.

**Section 69:** Reimbursement of a person who pays money on behalf of another in which he is interested.

**Section 70:** Obligation of a person enjoying the benefit of a non-gratuitous act.

**Section 71:** Responsibility of a finder of goods.

**Section 72:** Money paid by mistake or under coercion must be repaid.

**Key Case:** *State of Orissa v. Bhagaban* (1963) - The Supreme Court explained the principle of quasi-contract.

### 4.5 Previous Year Questions (UP PCS-J)

**2019:** Explain quasi-contracts under the Indian Contract Act. How do they differ from true contracts?

**2017:** "Every agreement in restraint of trade is void." Discuss with exceptions.

**2015:** Distinguish between void and voidable agreements.`
      },
      {
        id: "topic-025",
        title: "Discharge & Remedies for Breach of Contract",
        summary: "Discharge: performance, mutual agreement, frustration, lapse of time, operation of law, breach. Remedies: damages (Hadley v. Baxendale rule), quantum meruit, specific performance, injunction.",
        difficulty: "hard",
        content: `## Chapter 5: Discharge & Remedies for Breach of Contract

### 5.1 Modes of Discharge of Contract

A contract can be discharged in the following ways:

#### 1. Discharge by Performance
When both parties fulfill their obligations, the contract is discharged.

**Types of Performance:**
- Actual performance: Both parties have performed their obligations.
- Attempted performance (tender): One party offers to perform but the other party refuses to accept.

#### 2. Discharge by Mutual Agreement
- **Novation:** Substitution of a new contract for an existing one.
- **Alteration:** Change in the terms of the contract by mutual agreement.
- **Rescission:** Cancellation of the contract.
- **Remission:** Acceptance of a lesser consideration than what was agreed.
- **Accord and Satisfaction:** Agreement to accept something different from what was originally agreed.

#### 3. Discharge by Impossibility of Performance (Section 56)

**Doctrine of Frustration:** A contract becomes void when the act becomes impossible or unlawful after the contract is made.

**Key Cases:**
- *Taylor v. Caldwell* (1863) - The English case that established the doctrine of frustration. A music hall was destroyed by fire before the date of performance.
- *Satyabrata Ghose v. Mugneeram Bangur* (1954) - The Supreme Court explained the doctrine of frustration in India. The Court held that impossibility under Section 56 includes not only physical impossibility but also impracticability and uselessness.
- *Krell v. Henry* (1903) - The coronation procession of King Edward VII was cancelled. The contract for hiring a room to view the procession was frustrated.

**Initial Impossibility vs Subsequent Impossibility:**
- Initial impossibility: The act was impossible at the time of making the contract. The agreement is void ab initio.
- Subsequent impossibility: The act becomes impossible after the contract is made. The contract becomes void.

#### 4. Discharge by Lapse of Time
A contract is discharged if it is not performed or enforced within the period prescribed by the Limitation Act, 1963.

#### 5. Discharge by Operation of Law
- Death of the promisor (in contracts involving personal skill).
- Insolvency.
- Merger (inferior right merges into a superior right).

#### 6. Discharge by Breach of Contract
When a party fails to perform their obligation, the other party is discharged from their obligation and can claim remedies.

### 5.2 Remedies for Breach of Contract

#### 1. Damages (Section 73)

Damages are monetary compensation for loss or damage caused by breach of contract.

**Rule in Hadley v. Baxendale (1854):**
Damages are recoverable only if they:
1. Arise naturally from the breach (ordinary damages).
2. Were in the contemplation of the parties at the time of the contract (special damages).

**Key Cases:**
- *Hadley v. Baxendale* (1854) - The plaintiffs' mill was stopped due to delay in delivery of a broken shaft. The court held that the defendants were not liable for the loss of profits because they were not aware that the delay would stop the mill.
- *Fateh Chand v. Balkishan Das* (1963) - The Supreme Court explained the distinction between liquidated damages and penalty.

#### 2. Quantum Meruit

"Quantum meruit" means "as much as earned." It is a claim for reasonable compensation for work done when a contract is discharged.

#### 3. Specific Performance

The court may order the defaulting party to perform their obligation. This remedy is governed by the Specific Relief Act, 1963.

#### 4. Injunction

The court may restrain a party from doing something that would constitute a breach of contract.

### 5.3 Liquidated Damages vs Penalty (Section 74)

**Liquidated Damages:** A genuine pre-estimate of loss. Enforceable.

**Penalty:** A sum fixed in terrorem (to frighten). Not enforceable. The court awards reasonable compensation not exceeding the amount named.

**Key Case:** *Fateh Chand v. Balkishan Das* (1963) - The Supreme Court held that Section 74 applies to both liquidated damages and penalty. The court awards reasonable compensation not exceeding the amount named.

### 5.4 Previous Year Questions (UP PCS-J)

**2023:** Explain the doctrine of frustration under Section 56. What remedies are available for breach of contract?

**2021:** Distinguish between liquidated damages and penalty.

**2019:** "Damages are awarded to compensate, not to punish." Discuss with reference to Hadley v. Baxendale.`
      }
    ]
  },
  "Evidence Law": {
    bookId: "book-003",
    chapters: [{ id: "topic-031", title: "Introduction to Evidence Law", summary: "Basics of Evidence", difficulty: "medium", content: "## Basics of Evidence Law\nIntroduction to the Bharatiya Sakshya Adhiniyam." }]
  },
  "Criminal Law": {
    bookId: "book-004",
    chapters: [{ id: "topic-041", title: "General Principles of Criminal Law", summary: "Mens Rea and Actus Reus", difficulty: "medium", content: "## General Principles\nOverview of IPC and BNS." }]
  },
  "Jurisprudence": {
    bookId: "book-006",
    chapters: [{ id: "topic-061", title: "Schools of Jurisprudence", summary: "Analytical, Historical, Sociological", difficulty: "hard", content: "## Schools of Jurisprudence\nStudy of legal theory." }]
  },
  "Law of Torts": {
    bookId: "book-007",
    chapters: [{ id: "topic-071", title: "Nature of Tortious Liability", summary: "Civil wrongs", difficulty: "medium", content: "## Law of Torts\nIntroduction to tortious liability and damages." }]
  },
  "Transfer of Property": {
    bookId: "book-008",
    chapters: [{ id: "topic-081", title: "Concept of Property", summary: "Movable vs Immovable", difficulty: "medium", content: "## Transfer of Property\nBasics of TPA 1882." }]
  },
  "Limitation & Court Fees": {
    bookId: "book-009",
    chapters: [{ id: "topic-091", title: "Law of Limitation", summary: "Time limits for suits", difficulty: "medium", content: "## Limitation Act\nComputation of limitation period." }]
  },
  "U.P. Local Laws": {
    bookId: "book-010",
    chapters: [{ id: "topic-101", title: "U.P. Revenue Code", summary: "Revenue Administration", difficulty: "hard", content: "## UP Local Laws\nOverview of the UP Revenue Code 2006." }]
  }
};

async function seedContent() {
  try {
    await initDatabase();
    const db = getDb();

    console.log('Seeding comprehensive legal content...');

    let topicCount = 0;
    let chapterCount = 0;

    for (const [subject, data] of Object.entries(CONTENT)) {
      console.log(`\nProcessing: ${subject}`);

      for (const chapter of data.chapters) {
        const existing = db.prepare('SELECT id FROM topics WHERE id = ?').get(chapter.id);

        if (existing) {
          db.prepare(`
            UPDATE topics SET title = ?, subject = ?, content = ?, summary = ?,
              exam_tags = ?, semester = ?, difficulty = ?, order_index = ?, book_id = ?
            WHERE id = ?
          `).run(
            chapter.title, subject, chapter.content, chapter.summary,
            'UP PCS-J,Judicial Services,Civil Judge,UPSC,LLB',
            subject === 'Constitutional Law' ? 3 : subject === 'Civil Procedure' ? 4 : 2,
            chapter.difficulty, parseInt(chapter.id.split('-')[1]),
            data.bookId, chapter.id
          );
          console.log(`  Updated: ${chapter.title}`);
        } else {
          db.prepare(`
            INSERT INTO topics (id, book_id, parent_topic_id, title, subject, content, summary,
              exam_tags, semester, difficulty, order_index, topic_path)
            VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            chapter.id, data.bookId, chapter.title, subject, chapter.content, chapter.summary,
            'UP PCS-J,Judicial Services,Civil Judge,UPSC,LLB',
            subject === 'Constitutional Law' ? 3 : subject === 'Civil Procedure' ? 4 : 2,
            chapter.difficulty, parseInt(chapter.id.split('-')[1]),
            `${subject} > ${chapter.title}`
          );
          console.log(`  Inserted: ${chapter.title}`);
        }
        topicCount++;
        chapterCount++;
      }
    }

    db.save();
    console.log(`\nContent seeding complete: ${topicCount} topics across ${chapterCount} chapters`);
    console.log('Subjects covered: ' + Object.keys(CONTENT).join(', '));

  } catch (err) {
    console.error('Content seed error:', err);
    process.exit(1);
  }
}

seedContent();
